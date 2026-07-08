/**
 * 路由 - 用户信息
 */
const express = require('express');
const router = express.Router();
const { readJSON, writeJSON, findById } = require('../utils/fileStore');

// ========== GET /api/users/:id ==========
// 获取用户信息（不返回密码）
router.get('/:id', (req, res) => {
  const users = readJSON('users.json');
  const user = findById(users, req.params.id);

  if (!user) {
    return res.json({ code: 404, msg: '用户不存在' });
  }

  const { password, ...userInfo } = user;
  res.json({ code: 200, msg: '获取成功', data: userInfo });
});

// ========== PUT /api/users/:id ==========
// 更新用户资料和隐私设置
router.put('/:id', (req, res) => {
  const users = readJSON('users.json');
  const user = findById(users, req.params.id);

  if (!user) {
    return res.json({ code: 404, msg: '用户不存在' });
  }

  // 允许更新的字段列表
  const allowedFields = [
    'avatar', 'nickname', 'contact',
    'school', 'campus', 'grade', 'major'
  ];

  // 逐个更新允许的字段
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  // 更新隐私设置
  if (req.body.privacySettings) {
    // 合并而不是覆盖，保留未传的字段
    user.privacySettings = {
      ...user.privacySettings,
      ...req.body.privacySettings
    };
  }

  writeJSON('users.json', users);

  const { password, ...userInfo } = user;
  res.json({ code: 200, msg: '更新成功', data: userInfo });
});

// ========== PUT /api/users/:id/password ==========
// 修改密码
router.put('/:id/password', (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const users = readJSON('users.json');
  const user = findById(users, req.params.id);

  if (!user) {
    return res.json({ code: 404, msg: '用户不存在' });
  }
  if (user.password !== oldPassword) {
    return res.json({ code: 400, msg: '原密码不正确' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.json({ code: 400, msg: '新密码不能少于6位' });
  }
  if (newPassword !== confirmPassword) {
    return res.json({ code: 400, msg: '两次输入的密码不一致' });
  }
  if (newPassword === oldPassword) {
    return res.json({ code: 400, msg: '新密码不能和旧密码相同' });
  }

  user.password = newPassword;
  writeJSON('users.json', users);

  res.json({ code: 200, msg: '密码修改成功' });
});

// ========== GET /api/users/:id/products ==========
// 查看我的发布（该用户发布的商品列表）
router.get('/:id/products', (req, res) => {
  const users = readJSON('users.json');
  const user = findById(users, req.params.id);
  if (!user) {
    return res.json({ code: 404, msg: '用户不存在' });
  }

  const products = readJSON('products.json');
  // 返回该用户发布的商品
  const myProducts = products.filter(p => p.publisherId === req.params.id);

  res.json({ code: 200, msg: '获取成功', data: myProducts });
});

// ========== GET /api/users/:id/favorites ==========
// 查看我的收藏（返回收藏的商品详情列表）
router.get('/:id/favorites', (req, res) => {
  const users = readJSON('users.json');
  const user = findById(users, req.params.id);
  if (!user) {
    return res.json({ code: 404, msg: '用户不存在' });
  }

  const favorites = readJSON('favorites.json');
  const products = readJSON('products.json');

  // 找到该用户的所有收藏记录
  const userFavs = favorites.filter(f => f.userId === req.params.id);

  // 拼出收藏的商品详情
  const favProducts = userFavs
    .map(fav => {
      const product = products.find(p => p.id === fav.productId);
      if (product) {
        return { ...product, favoriteId: fav.id, favoritedAt: fav.createdAt };
      }
      return null;
    })
    .filter(Boolean); // 过滤掉已删除的商品

  res.json({ code: 200, msg: '获取成功', data: favProducts });
});

// ========== GET /api/users/:id/reports ==========
// 查看我的举报
router.get('/:id/reports', (req, res) => {
  const users = readJSON('users.json');
  const user = findById(users, req.params.id);
  if (!user) {
    return res.json({ code: 404, msg: '用户不存在' });
  }

  const reports = readJSON('reports.json');
  const myReports = reports.filter(r => r.reporterId === req.params.id);

  res.json({ code: 200, msg: '获取成功', data: myReports });
});

// ========== GET /api/users/:id/orders ==========
// 查看我购买的订单（buyerId = 当前用户 id）
router.get('/:id/orders', (req, res) => {
  const users = readJSON('users.json');
  const user = findById(users, req.params.id);
  if (!user) {
    return res.json({ code: 404, msg: '用户不存在' });
  }

  const orders = readJSON('orders.json');
  const buyerOrders = orders.filter(o => o.buyerId === req.params.id);

  res.json({ code: 200, msg: '获取成功', data: buyerOrders });
});

// ========== GET /api/users/:id/sold-orders ==========
// 查看我卖出的订单（sellerId = 当前用户 id）
router.get('/:id/sold-orders', (req, res) => {
  const users = readJSON('users.json');
  const user = findById(users, req.params.id);
  if (!user) {
    return res.json({ code: 404, msg: '用户不存在' });
  }

  const orders = readJSON('orders.json');
  const soldOrders = orders.filter(o => o.sellerId === req.params.id);

  res.json({ code: 200, msg: '获取成功', data: soldOrders });
});

module.exports = router;
