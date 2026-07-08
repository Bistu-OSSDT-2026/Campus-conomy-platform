# CampusMarket 后端服务

开源校园经济小程序的后端 API 服务。

## 技术栈

- **Node.js** + **Express**（轻量 Web 框架）
- **JSON 文件存储**（无需安装数据库，方便演示）

## 快速启动

```bash
# 1. 进入 server 目录
cd server

# 2. 安装依赖（只需执行一次）
npm install

# 3. 启动服务
npm start
```

启动成功后，控制台输出：

```
========================================
  CampusMarket 后端服务已启动
  地址: http://localhost:3000
  测试: http://localhost:3000/api/products
  按 Ctrl+C 停止服务
========================================
```

## 项目结构

```
server/
├── app.js                 # 主入口，启动 Express 服务
├── package.json           # 依赖配置
├── README.md              # 本文档
├── data/                  # JSON 数据文件（模拟数据库）
│   ├── users.json         # 用户数据
│   ├── products.json      # 商品数据
│   ├── favorites.json     # 收藏数据
│   ├── reports.json       # 举报数据
│   ├── orders.json        # 订单数据
│   └── schools.json       # 北京市高校列表
├── utils/                 # 工具函数
│   ├── fileStore.js       # JSON 文件读写
│   └── id.js              # ID 生成 & 时间格式化
└── routes/                # 路由模块（接口实现）
    ├── auth.js            # 注册/登录/校园认证
    ├── users.js           # 用户信息/我的发布/我的收藏/我的订单
    ├── products.js        # 商品增删改查
    ├── favorites.js       # 收藏/取消收藏
    ├── reports.js         # 举报/管理员处理
    ├── orders.js          # 下单/订单状态
    └── schools.js         # 学校列表查询
```

## 接口列表

### 一、认证模块

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册账号 |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/certification` | 校园身份认证 |

### 二、用户模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/users/:id` | 获取用户信息 |
| PUT | `/api/users/:id` | 更新用户资料 |
| PUT | `/api/users/:id/password` | 修改密码 |
| GET | `/api/users/:id/products` | 查看我的发布 |
| GET | `/api/users/:id/favorites` | 查看我的收藏 |
| GET | `/api/users/:id/reports` | 查看我的举报 |
| GET | `/api/users/:id/orders` | 查看我购买的订单 |
| GET | `/api/users/:id/sold-orders` | 查看我卖出的订单 |

### 三、商品模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/products` | 获取商品列表（支持筛选） |
| GET | `/api/products/:id` | 获取商品详情（浏览量+1） |
| POST | `/api/products` | 发布商品 |
| PUT | `/api/products/:id` | 编辑商品 |
| DELETE | `/api/products/:id` | 删除商品 |
| PUT | `/api/products/:id/status` | 修改商品状态 |

### 四、收藏模块

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/favorites` | 添加收藏 |
| DELETE | `/api/favorites` | 取消收藏 |

### 五、举报模块

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/reports` | 提交举报 |
| GET | `/api/admin/reports` | 管理员查看全部举报 |
| PUT | `/api/admin/reports/:id` | 管理员处理举报 |

### 六、订单模块

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/orders` | 提交订单 |
| GET | `/api/orders/:id` | 查看订单详情 |
| PUT | `/api/orders/:id/status` | 修改订单状态 |

### 七、学校模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/schools` | 获取学校列表 |
| GET | `/api/schools?keyword=信息` | 按关键词搜索学校 |

## 预置测试账号

| 角色 | 账号（手机号） | 密码 | 说明 |
|------|---------------|------|------|
| 普通用户 | 13800001111 | 123456 | 小明同学，已认证 |
| 普通用户 | 13800002222 | 123456 | 小红学姐，已认证 |
| 管理员 | 13800000000 | admin123 | 校园管理员 |

## 微信小程序前端调用示例

### 1. 登录

```javascript
wx.request({
  url: 'http://localhost:3000/api/auth/login',
  method: 'POST',
  data: {
    account: '13800001111',
    password: '123456'
  },
  success(res) {
    console.log(res.data); // { code: 200, msg: '登录成功', data: {...} }
    // 保存 userId 到本地
    wx.setStorageSync('userId', res.data.data.id);
  }
});
```

### 2. 获取商品列表

```javascript
wx.request({
  url: 'http://localhost:3000/api/products',
  method: 'GET',
  data: {
    category: '教材资料',    // 可选：按分类筛选
    school: '北京信息科技大学', // 可选：按学校筛选
    keyword: '数据结构'        // 可选：按关键词搜索
  },
  success(res) {
    console.log(res.data.data); // 商品数组
  }
});
```

### 3. 发布商品

```javascript
wx.request({
  url: 'http://localhost:3000/api/products',
  method: 'POST',
  data: {
    title: '二手高数教材',
    category: '教材资料',
    price: 20,
    images: ['/images/goods/book1.png'],
    description: '九成新，上册下册都有',
    publisherId: 'u001'  // 当前登录用户的 id
  },
  success(res) {
    console.log(res.data); // { code: 200, msg: '发布成功', data: {...} }
  }
});
```

### 4. 提交举报

```javascript
wx.request({
  url: 'http://localhost:3000/api/reports',
  method: 'POST',
  data: {
    productId: 'p001',
    reporterId: 'u002',
    reason: '虚假信息',
    description: '商品描述与实际不符'
  },
  success(res) {
    console.log(res.data);
  }
});
```

### 5. 查看我的发布

```javascript
wx.request({
  url: 'http://localhost:3000/api/users/u001/products',
  method: 'GET',
  success(res) {
    console.log(res.data.data); // 该用户发布的商品数组
  }
});
```

### 6. 查看我的订单

```javascript
wx.request({
  url: 'http://localhost:3000/api/users/u001/orders',
  method: 'GET',
  success(res) {
    console.log(res.data.data); // 该用户购买的订单数组
  }
});
```

## 微信开发者工具注意事项

1. **后端地址**：启动后默认地址是 `http://localhost:3000`
2. **如果 localhost 请求失败**，可以改用 `http://127.0.0.1:3000`
3. **开发阶段**必须在微信开发者工具中勾选：
   - 详情 → 本地设置 → ✅ **不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书**
4. **正式上线**时不能使用 localhost，需要将后端部署到服务器并配置 HTTPS 域名，再在微信公众平台配置服务器域名白名单

## 测试接口

启动服务后，可以在浏览器中直接访问以下地址测试：

| 测试地址 | 说明 |
|----------|------|
| http://localhost:3000/ | 服务首页 |
| http://localhost:3000/api/products | 商品列表 |
| http://localhost:3000/api/schools | 学校列表 |
| http://localhost:3000/api/schools?keyword=信息 | 搜索含"信息"的学校 |
| http://localhost:3000/api/users/u001 | 用户信息 |
| http://localhost:3000/api/users/u001/products | 我的发布 |
| http://localhost:3000/api/users/u001/favorites | 我的收藏 |
| http://localhost:3000/api/users/u001/orders | 我购买的订单 |
| http://localhost:3000/api/users/u002/sold-orders | 我卖出的订单 |

POST/PUT/DELETE 接口需要使用 Postman 或类似工具测试。

## 数据说明

- 所有数据存储在 `server/data/` 目录下的 JSON 文件中
- 每次启动服务时会自动读取 JSON 文件
- 数据修改后会实时写入 JSON 文件，格式化缩进，方便直接查看
- 如需重置数据，直接编辑或删除对应的 JSON 文件，重启服务即可
