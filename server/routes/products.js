/**
 * 路由 - 商品/需求发布
 */
const express = require('express');
const router = express.Router();
const { readJSON, writeJSON, findById, findIndexById } = require('../utils/fileStore');
const { generateId, getNow } = require('../utils/id');

// ========== GET /api/products ==========
// 获取商品列表（支持筛选）
router.get('/', (req, res) => {
  let products = readJSON('products.json');
  const { category, school, campus, keyword, publisherId } = req.query;

  // 按分类筛选
  if (category) {
    products = products.filter(p => p.category === category);
  }
  // 按学校筛选
  if (school) {
    products = products.filter(p => p.school === school);
  }
  // 按校区筛选
  if (campus) {
    products = products.filter(p => p.campus === campus);
  }
  // 按关键词搜索（标题和描述）
  if (keyword) {
    const kw = keyword.toLowerCase();
    products = products.filter(p =>
      p.title.toLowerCase().includes(kw) ||
      p.description.toLowerCase().includes(kw)
    );
  }
  // 按发布者筛选
  if (publisherId) {
    products = products.filter(p => p.publisherId === publisherId);
  }

  res.json({ code: 200, msg: '获取成功', data: products });
});

// ========== GET /api/products/:id ==========
// 获取商品详情（每次查看 views +1）
router.get('/:id', (req, res) => {
  const products = readJSON('products.json');
  const product = findById(products, req.params.id);

  if (!product) {
    return res.json({ code: 404, msg: '商品不存在' });
  }

  // 浏览量 +1
  product.views = (product.views || 0) + 1;
  writeJSON('products.json', products);

  res.json({ code: 200, msg: '获取成功', data: product });
});

// ========== POST /api/products ==========
// 发布商品/需求
router.post('/', (req, res) => {
  console.log('========================================');
  console.log('[POST /api/products] 收到发布商品请求');
  console.log('[POST /api/products] 请求体：', JSON.stringify(req.body, null, 2));

  const {
    title, category, price, images, description,
    school, campus, tradeLocation, contact, negotiable,
    publisherId
  } = req.body;

  // 校验：用户必须存在
  const users = readJSON('users.json');
  const user = findById(users, publisherId);
  if (!user) {
    return res.json({ code: 400, msg: '用户不存在' });
  }

  // 校验：用户必须完成校园认证
  if (!user.certified) {
    return res.json({ code: 400, msg: '请先完成校园认证' });
  }

  // 校验：必填字段
  if (!title) {
    console.log('[POST /api/products] ❌ 缺少标题');
    return res.json({ code: 400, msg: '缺少标题，请填写商品标题' });
  }
  if (!category) {
    console.log('[POST /api/products] ❌ 缺少分类');
    return res.json({ code: 400, msg: '缺少分类，请选择商品分类' });
  }
  if (price === undefined || price === null) {
    console.log('[POST /api/products] ❌ 缺少价格');
    return res.json({ code: 400, msg: '缺少价格，请填写商品售价' });
  }
  if (!description) {
    console.log('[POST /api/products] ❌ 缺少描述');
    return res.json({ code: 400, msg: '缺少描述，请填写商品描述' });
  }
  if (!publisherId) {
    console.log('[POST /api/products] ❌ 缺少发布者ID');
    return res.json({ code: 400, msg: '缺少发布者ID' });
  }

  // 读取现有商品列表
  const products = readJSON('products.json');

  const newProduct = {
    id: generateId('p'),
    title: title.trim(),
    category: category,
    price: Number(price) || 0,
    images: Array.isArray(images) ? images : [],
    description: description.trim(),
    school: school || user.school || '',
    campus: campus || user.campus || '',
    tradeLocation: tradeLocation || '',
    contact: contact || user.contact || '',
    negotiable: negotiable !== false,
    publisherId: user.id,
    publisherName: user.nickname,
    publisherAvatar: user.avatar || '/images/default-avatar.png',
    status: '在售',
    views: 0,
    favoriteCount: 0,
    reportCount: 0,
    createdAt: getNow(),
    updatedAt: getNow()
  };

  products.push(newProduct);
  writeJSON('products.json', products);

  console.log('[POST /api/products] ✅ 发布成功！新商品ID：', newProduct.id);
  console.log('[POST /api/products] 商品标题：', newProduct.title);
  console.log('========================================');

  res.json({ code: 200, msg: '发布成功', data: newProduct });
});

// ========== PUT /api/products/:id ==========
// 编辑商品（只有发布者本人可以编辑）
router.put('/:id', (req, res) => {
  const products = readJSON('products.json');
  const product = findById(products, req.params.id);

  if (!product) {
    return res.json({ code: 404, msg: '商品不存在' });
  }

  const { userId } = req.body;
  // 权限校验：只有发布者本人可以编辑
  if (product.publisherId !== userId) {
    return res.json({ code: 403, msg: '只有发布者本人可以编辑' });
  }

  // 允许更新的字段
  const allowedFields = [
    'title', 'category', 'price', 'images', 'description',
    'school', 'campus', 'tradeLocation', 'contact', 'negotiable'
  ];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  product.updatedAt = getNow();
  writeJSON('products.json', products);

  res.json({ code: 200, msg: '编辑成功', data: product });
});

// ========== DELETE /api/products/:id ==========
// 删除商品（只有发布者本人可以删除）
router.delete('/:id', (req, res) => {
  const products = readJSON('products.json');
  const index = findIndexById(products, req.params.id);

  if (index === -1) {
    return res.json({ code: 404, msg: '商品不存在' });
  }

  const product = products[index];
  const { userId } = req.query;  // 通过 query 参数传递 userId

  // 权限校验
  if (product.publisherId !== userId) {
    return res.json({ code: 403, msg: '只有发布者本人可以删除' });
  }

  products.splice(index, 1);
  writeJSON('products.json', products);

  res.json({ code: 200, msg: '删除成功' });
});

// ========== PUT /api/products/:id/status ==========
// 修改商品状态（在售 / 已下架 / 已完成）
router.put('/:id/status', (req, res) => {
  const products = readJSON('products.json');
  const product = findById(products, req.params.id);

  if (!product) {
    return res.json({ code: 404, msg: '商品不存在' });
  }

  const { status, userId } = req.body;
  const validStatuses = ['在售', '已下架', '已完成'];

  if (!validStatuses.includes(status)) {
    return res.json({ code: 400, msg: '无效状态，只支持：在售、已下架、已完成' });
  }

  // 权限：只有发布者本人可以修改状态
  if (userId && product.publisherId !== userId) {
    return res.json({ code: 403, msg: '只有发布者本人可以修改状态' });
  }

  product.status = status;
  product.updatedAt = getNow();
  writeJSON('products.json', products);

  res.json({ code: 200, msg: '状态更新成功', data: product });
});

module.exports = router;
