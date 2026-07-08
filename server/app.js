/**
 * CampusMarket 后端服务入口
 * 
 * 启动方式：
 *   1. cd server
 *   2. npm install
 *   3. npm start
 * 
 * 服务地址：http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// 导入各路由模块
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const favoritesRoutes = require('./routes/favorites');
const reportsRoutes = require('./routes/reports');
const ordersRoutes = require('./routes/orders');
const schoolsRoutes = require('./routes/schools');

const app = express();
const PORT = 3000;

// ---------- 中间件 ----------
// 允许跨域请求（微信小程序需要）
app.use(cors());
// 解析 JSON 请求体（express 4.16+ 内置）
app.use(express.json());
// body-parser 作为兜底（兼容旧版写法）
app.use(bodyParser.json());
// 解析 URL 编码请求体
app.use(bodyParser.urlencoded({ extended: true }));

// ---------- 路由挂载 ----------
// 注意：users 路由放在后面，避免 /:id 匹配到其他路由前缀
app.use('/api/auth', authRoutes);           // 认证（注册/登录/校园认证）
app.use('/api/products', productsRoutes);    // 商品
app.use('/api/favorites', favoritesRoutes);  // 收藏
app.use('/api/reports', reportsRoutes);      // 举报
app.use('/api/orders', ordersRoutes);        // 订单
app.use('/api/schools', schoolsRoutes);      // 学校列表
app.use('/api/users', usersRoutes);          // 用户（放在最后，因为包含 /:id 动态路由）

// ---------- 健康检查 ----------
app.get('/api/health', (req, res) => {
  res.json({ code: 200, msg: 'server ok' });
});

// ---------- 首页提示 ----------
app.get('/', (req, res) => {
  res.json({
    name: 'CampusMarket 开源校园经济小程序 - 后端服务',
    version: '1.0.0',
    docs: '请查看 server/README.md 了解接口文档',
    baseUrl: 'http://localhost:3000'
  });
});

// ---------- 启动服务 ----------
app.listen(PORT, () => {
  console.log('========================================');
  console.log('  CampusMarket 后端服务已启动');
  console.log(`  地址: http://localhost:${PORT}`);
  console.log(`  测试: http://localhost:${PORT}/api/products`);
  console.log('  按 Ctrl+C 停止服务');
  console.log('========================================');
});
