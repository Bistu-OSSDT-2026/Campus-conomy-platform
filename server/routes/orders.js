/**
 * 路由 - 订单
 */
const express = require('express');
const router = express.Router();
const { readJSON, writeJSON, findById } = require('../utils/fileStore');
const { generateId, getNow, generateOrderId } = require('../utils/id');

// ========== POST /api/orders ==========
// 提交订单（购买商品）
router.post('/', (req, res) => {
  const { productId, buyerId, quantity, remark } = req.body;

  // 校验：买家存在
  const users = readJSON('users.json');
  const buyer = findById(users, buyerId);
  if (!buyer) {
    return res.json({ code: 400, msg: '用户不存在' });
  }

  // 校验：买家已完成校园认证
  if (!buyer.certified) {
    return res.json({ code: 400, msg: '请先完成校园认证再下单' });
  }

  // 校验：商品存在
  const products = readJSON('products.json');
  const product = findById(products, productId);
  if (!product) {
    return res.json({ code: 400, msg: '商品不存在' });
  }

  // 校验：不能购买自己发布的商品
  if (product.publisherId === buyerId) {
    return res.json({ code: 400, msg: '不能购买自己发布的商品' });
  }

  // 校验：商品状态必须为"在售"
  if (product.status !== '在售') {
    return res.json({ code: 400, msg: '该商品当前不可购买' });
  }

  // 获取卖家信息
  const seller = findById(users, product.publisherId);

  const qty = quantity || 1;

  // 创建订单
  const order = {
    id: generateId('ord'),
    orderId: generateOrderId(),
    productId: product.id,
    productTitle: product.title,
    productImage: (product.images && product.images[0]) || '',
    price: product.price,
    quantity: qty,
    totalPrice: product.price * qty,
    buyerId: buyer.id,
    buyerName: buyer.nickname,
    buyerContact: buyer.contact || '',
    sellerId: seller ? seller.id : product.publisherId,
    sellerName: seller ? seller.nickname : product.publisherName,
    sellerContact: seller ? seller.contact : '',
    tradeLocation: product.tradeLocation || '',
    remark: remark || '',
    status: '待确认',
    createdAt: getNow(),
    updatedAt: getNow()
  };

  const orders = readJSON('orders.json');
  orders.push(order);
  writeJSON('orders.json', orders);

  res.json({ code: 200, msg: '下单成功', data: order });
});

// ========== GET /api/orders/:id ==========
// 查看订单详情
router.get('/:id', (req, res) => {
  const orders = readJSON('orders.json');
  // 支持用 orderId 或 id 查询
  const order = orders.find(o => o.id === req.params.id || o.orderId === req.params.id);

  if (!order) {
    return res.json({ code: 404, msg: '订单不存在' });
  }

  res.json({ code: 200, msg: '获取成功', data: order });
});

// ========== PUT /api/orders/:id/status ==========
// 修改订单状态
router.put('/:id/status', (req, res) => {
  const { status, userId } = req.body;

  const orders = readJSON('orders.json');
  const order = orders.find(o => o.id === req.params.id || o.orderId === req.params.id);

  if (!order) {
    return res.json({ code: 404, msg: '订单不存在' });
  }

  // 状态流转规则
  const validTransitions = {
    '待确认': ['已确认', '已取消'],
    '已确认': ['已完成'],
    '已完成': [],
    '已取消': []
  };

  const currentStatus = order.status;
  if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(status)) {
    return res.json({
      code: 400,
      msg: `当前状态"${currentStatus}"不能变更为"${status}"`
    });
  }

  // 如果是取消订单，只能由买家操作
  if (status === '已取消' && userId && order.buyerId !== userId) {
    return res.json({ code: 403, msg: '只有买家可以取消订单' });
  }

  // 如果是确认/完成订单，只能由卖家操作
  if ((status === '已确认' || status === '已完成') && userId && order.sellerId !== userId) {
    return res.json({ code: 403, msg: '只有卖家可以操作' });
  }

  order.status = status;
  order.updatedAt = getNow();
  writeJSON('orders.json', orders);

  res.json({ code: 200, msg: '订单状态更新成功', data: order });
});

module.exports = router;
