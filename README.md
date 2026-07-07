# campus-economy-platform

> 面向校园场景的微信小程序，主要用于校园二手交易、资料共享和校园服务等场景。

## 项目简介

这是一个校园经济平台微信小程序，为在校大学生提供一个便捷的二手物品交易、技能互助、校园跑腿等信息发布与交流平台。

## 项目特点

- 🎓 **微信小程序** — 基于微信原生框架，无需安装，扫码即用
- 🏫 **校园经济平台** — 专为校园场景设计，覆盖二手交易、资料共享、技能互助等
- 🤖 **AI 辅助开发** — 部分代码由 AI 辅助生成，提升开发效率
- 📖 **开源实践** — 适合微信小程序初学者学习

## 已完成功能

- [x] 基础框架搭建（TabBar、页面路由、全局配置）
- [x] 商品列表展示（首页-最新发布）
- [x] 商品详情页
- [x] 分类浏览页面
- [x] 模拟接口数据（本地 JSON 数据）
- [x] 用户登录/注册（含本地模拟登录降级）
- [x] 校园身份认证
- [x] 商品发布（对接后端 API）
- [x] 我的发布管理
- [x] 我的收藏
- [x] 个人设置（资料修改、隐私设置、密码修改）
- [x] 后端服务（Express + JSON 文件存储）

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | 微信小程序原生框架（WXML + WXSS + JS） |
| 后端 | Node.js + Express |
| 数据存储 | JSON 文件存储（`server/data/`） |

## 项目结构

```
campus-economy-platform/
├── app.js                  # 小程序入口
├── app.json                # 小程序全局配置
├── app.wxss                # 全局样式
├── sitemap.json            # 站点地图
├── pages/                  # 页面目录
│   ├── home/               # 首页（商品列表）
│   ├── category/           # 分类页
│   ├── publish/            # 发布页
│   ├── detail/             # 商品详情
│   ├── login/              # 登录/注册
│   ├── verify/             # 校园认证
│   ├── mine/               # 我的页面
│   ├── my-posts/           # 我的发布
│   ├── my-favorites/       # 我的收藏
│   ├── my-orders/          # 我的订单
│   ├── order-detail/       # 订单详情
│   ├── my-reports/         # 我的举报
│   ├── settings/           # 个人设置
│   ├── agreement/          # 用户协议
│   ├── admin/              # 管理员页面
│   └── opensource/         # 开源声明
├── images/                 # 图片资源
├── data/                   # 前端模拟数据
│   └── beijingColleges.js  # 北京高校名单
├── server/                 # 后端服务
│   ├── app.js              # 服务入口
│   ├── routes/             # API 路由
│   ├── data/               # JSON 数据文件
│   └── utils/              # 工具函数
└── project.config.json     # 微信开发者工具配置
```

## 运行方式

### 前置条件

- 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 安装 [Node.js](https://nodejs.org/)（用于运行后端服务，推荐 v18+）

### 启动后端服务

```bash
cd server
npm install
npm start
```

后端服务默认运行在 `http://127.0.0.1:3000`。

### 启动小程序

1. 打开微信开发者工具
2. 选择「导入项目」，目录选择本项目根目录
3. **AppID 选择「测试号」**（`touristappid`）
4. 点击「编译」即可预览

> ⚠️ **注意**：本项目 `project.config.json` 中已配置 AppID 为 `touristappid`（测试号通用 ID），导入后如开发者工具提示 AppID 不匹配，请在工具中手动切换为测试号。

## 后续计划

- [ ] 发布商品功能完善（图片上传）
- [ ] 用户登录对接真实后端
- [ ] 收藏功能持久化
- [ ] 交易沟通（站内消息）
- [ ] 后端接口完善（数据库替代 JSON 文件）
- [ ] 项目文档完善
- [ ] 单元测试覆盖

## 免责声明

- 本项目为开源学习项目，仅供学习和研究使用
- 项目中所有用户数据、商品信息、联系方式均为模拟数据，与真实人物无关
- 请勿将本项目直接用于生产环境

## License

MIT License
