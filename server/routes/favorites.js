/**
 * 路由 - 收藏
 */
const express = require('express');
const router = express.Router();
const { readJSON, writeJSON, findById } = require('../utils/fileStore');
const { generateId, getNow } = require('../utils/id');

// ========== POST /api/favorites ==========
// 添加收藏
router.post('/', (req, res) => {
  const { userId, productId } = req.body;

  // 校验：用户存在
  const users = readJSON('users.json');
  if (!findById(users, userId)) {
    return res.json({ code: 400, msg: '用户不存在' });
  }

  // 校验：商品存在
  const products = readJSON('products.json');
  const product = findById(products, productId);
  if (!product) {
    return res.json({ code: 400, msg: '商品不存在' });
  }

  // 校验：不能重复收藏
  const favorites = readJSON('favorites.json');
  const exists = favorites.find(f => f.userId === userId && f.productId === productId);
  if (exists) {
    return res.json({ code: 400, msg: '已收藏过该商品' });
  }

  // 添加收藏记录
  const fav = {
    id: generateId('fav'),
    userId,
    productId,
    createdAt: getNow()
  };
  favorites.push(fav);
  writeJSON('favorites.json', favorites);

  // 商品收藏数 +1
  product.favoriteCount = (product.favoriteCount || 0) + 1;
  writeJSON('products.json', products);

  res.json({ code: 200, msg: '收藏成功', data: fav });
});

// ========== DELETE /api/favorites ==========
// 取消收藏
router.delete('/', (req, res) => {
  const { userId, productId } = req.body;

  const favorites = readJSON('favorites.json');
  const index = favorites.findIndex(f => f.userId === userId && f.productId === productId);

  if (index === -1) {
    return res.json({ code: 400, msg: '未收藏该商品' });
  }

  favorites.splice(index, 1);
  writeJSON('favorites.json', favorites);

  // 商品收藏数 -1（不能小于0）
  const products = readJSON('products.json');
  const product = findById(products, productId);
  if (product && product.favoriteCount > 0) {
    product.favoriteCount -= 1;
    writeJSON('products.json', products);
  }

  res.json({ code: 200, msg: '取消收藏成功' });
});

module.exports = router;
