/**
 * 路由 - 学校列表
 */
const express = require('express');
const router = express.Router();
const { readJSON } = require('../utils/fileStore');

// ========== GET /api/schools ==========
// 获取学校列表，支持关键词搜索
router.get('/', (req, res) => {
  let schools = readJSON('schools.json');
  const { keyword } = req.query;

  // 如果传了 keyword，按学校名称模糊搜索
  if (keyword) {
    const kw = keyword.toLowerCase();
    schools = schools.filter(s => s.name.toLowerCase().includes(kw));
  }

  res.json({ code: 200, msg: '获取成功', data: schools });
});

module.exports = router;
