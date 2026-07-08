/**
 * 路由 - 举报
 */
const express = require('express');
const router = express.Router();
const { readJSON, writeJSON, findById } = require('../utils/fileStore');
const { generateId, getNow } = require('../utils/id');

// ========== POST /api/reports ==========
// 提交举报
router.post('/', (req, res) => {
  const { productId, reporterId, reason, description } = req.body;

  // 校验：用户存在
  const users = readJSON('users.json');
  const reporter = findById(users, reporterId);
  if (!reporter) {
    return res.json({ code: 400, msg: '用户不存在' });
  }

  // 校验：商品存在
  const products = readJSON('products.json');
  const product = findById(products, productId);
  if (!product) {
    return res.json({ code: 400, msg: '商品不存在' });
  }

  // 校验：不能重复举报同一商品
  const reports = readJSON('reports.json');
  const exists = reports.find(r => r.reporterId === reporterId && r.productId === productId);
  if (exists) {
    return res.json({ code: 400, msg: '您已举报过该商品，请等待处理' });
  }

  // 创建举报记录
  const report = {
    id: generateId('rpt'),
    productId: productId,
    productTitle: product.title,
    reportedUserId: product.publisherId,
    reportedUserName: product.publisherName,
    reporterId: reporterId,
    reporterName: reporter.nickname,
    reason: reason || '其他原因',
    description: description || '',
    status: '待处理',
    adminResult: '',
    createdAt: getNow(),
    handledAt: ''
  };

  reports.push(report);
  writeJSON('reports.json', reports);

  // 商品举报数 +1
  product.reportCount = (product.reportCount || 0) + 1;
  writeJSON('products.json', products);

  res.json({ code: 200, msg: '举报提交成功', data: report });
});

// ========== GET /api/admin/reports ==========
// 管理员查看全部举报（需要验证管理员身份）
router.get('/admin/reports', (req, res) => {
  const { adminId } = req.query;
  const users = readJSON('users.json');
  const admin = findById(users, adminId);

  if (!admin || !admin.isAdmin) {
    return res.json({ code: 403, msg: '无权限，仅管理员可查看' });
  }

  const reports = readJSON('reports.json');
  res.json({ code: 200, msg: '获取成功', data: reports });
});

// ========== PUT /api/admin/reports/:id ==========
// 管理员处理举报
router.put('/admin/reports/:id', (req, res) => {
  const { adminId, status, adminResult } = req.body;

  // 验证管理员身份
  const users = readJSON('users.json');
  const admin = findById(users, adminId);
  if (!admin || !admin.isAdmin) {
    return res.json({ code: 403, msg: '无权限，仅管理员可操作' });
  }

  // 校验状态
  if (status !== '已处理' && status !== '已驳回') {
    return res.json({ code: 400, msg: '状态只能为：已处理 或 已驳回' });
  }

  const reports = readJSON('reports.json');
  const report = findById(reports, req.params.id);
  if (!report) {
    return res.json({ code: 404, msg: '举报不存在' });
  }

  // 更新举报记录
  report.status = status;
  report.adminResult = adminResult || '';
  report.handledAt = getNow();
  writeJSON('reports.json', reports);

  // 如果处理结果包含"下架"，同步下架商品
  if (adminResult && adminResult.includes('下架')) {
    const products = readJSON('products.json');
    const product = findById(products, report.productId);
    if (product) {
      product.status = '已下架';
      product.updatedAt = getNow();
      writeJSON('products.json', products);
    }
  }

  res.json({ code: 200, msg: '处理成功', data: report });
});

module.exports = router;
