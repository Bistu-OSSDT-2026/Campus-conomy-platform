App({
  globalData: {
    // 用户信息
    userInfo: null,
    isLoggedIn: false,
    isVerified: false,
    // 管理员标识
    isAdmin: false,
    // 模拟数据
    goodsList: [],
    categories: [],
    announcements: [],
    reports: [],
    // 收藏列表（商品id数组）
    favorites: [],
    // 当前用户发布的商品
    myPosts: [],
    // 订单列表
    orders: []
  },

  onLaunch() {
    // 初始化模拟数据
    this.initMockData();
    // 检查本地登录状态
    this.checkLoginStatus();
  },

  // 初始化模拟数据
  initMockData() {
    const categories = [
      { id: 1, name: '教材教辅', icon: '📚', color: '#2F6BFF' },
      { id: 2, name: '电子产品', icon: '💻', color: '#FF6B6B' },
      { id: 3, name: '生活用品', icon: '🏠', color: '#51CF66' },
      { id: 4, name: '服饰鞋包', icon: '👗', color: '#FF922B' },
      { id: 5, name: '运动户外', icon: '⚽', color: '#845EF7' },
      { id: 6, name: '零食代购', icon: '🍔', color: '#F06595' },
      { id: 7, name: '技能服务', icon: '🎓', color: '#20C997' },
      { id: 8, name: '其他闲置', icon: '📦', color: '#868E96' }
    ];
    this.globalData.categories = categories;

    const goodsList = [
      {
        id: 1,
        title: '《数据结构》严蔚敏 全新正版',
        desc: '考研买的，基本没翻过，九成新。适合计算机专业同学。',
        price: 25,
        originalPrice: 49,
        categoryId: 1,
        categoryName: '教材教辅',
        cover: '/images/goods/book1.png',
        images: ['/images/goods/book1.png', '/images/goods/book2.png'],
        seller: { id: 1, name: '计算机-张三', avatar: '/images/avatar1.png', school: '信息工程学院', grade: '2022级', verified: true },
        status: 'published',
        viewCount: 238,
        favCount: 15,
        publishTime: '2026-06-28 10:30',
        condition: '九成新',
        tradePlace: '图书馆门口'
      },
      {
        id: 2,
        title: 'iPad Air 5 64G 星空灰 在保',
        desc: '去年10月购入，国行在保，无磕碰无划痕，送原装充电器和保护壳。换Pro了所以出。',
        price: 3200,
        originalPrice: 4399,
        categoryId: 2,
        categoryName: '电子产品',
        cover: '/images/goods/ipad1.png',
        images: ['/images/goods/ipad1.png', '/images/goods/ipad2.png'],
        seller: { id: 2, name: '设计-李四', avatar: '/images/avatar2.png', school: '艺术学院', grade: '2023级', verified: true },
        status: 'published',
        viewCount: 567,
        favCount: 42,
        publishTime: '2026-06-27 15:20',
        condition: '九五新',
        tradePlace: '二食堂门口'
      },
      {
        id: 3,
        title: '宿舍用小台灯 LED护眼',
        desc: '可调节亮度和色温，USB充电，非常方便。毕业带不走便宜出。',
        price: 18,
        originalPrice: 45,
        categoryId: 3,
        categoryName: '生活用品',
        cover: '/images/goods/lamp1.png',
        images: ['/images/goods/lamp1.png', '/images/goods/lamp2.png'],
        seller: { id: 3, name: '电子-王五', avatar: '/images/avatar3.png', school: '电子工程学院', grade: '2021级', verified: true },
        status: 'published',
        viewCount: 89,
        favCount: 7,
        publishTime: '2026-06-26 09:00',
        condition: '八成新',
        tradePlace: '宿舍楼3栋'
      },
      {
        id: 4,
        title: 'AJ1 Low 白红 42码 正品',
        desc: '官网购入，穿了不到5次，鞋底几乎没有磨损。尺码不合适故出。',
        price: 380,
        originalPrice: 899,
        categoryId: 4,
        categoryName: '服饰鞋包',
        cover: '/images/goods/shoe1.png',
        images: ['/images/goods/shoe1.png', '/images/goods/shoe2.png'],
        seller: { id: 4, name: '体育-赵六', avatar: '/images/avatar4.png', school: '体育学院', grade: '2022级', verified: true },
        status: 'published',
        viewCount: 412,
        favCount: 28,
        publishTime: '2026-06-25 14:00',
        condition: '九五新',
        tradePlace: '操场南门'
      },
      {
        id: 5,
        title: '尤尼克斯羽毛球拍一对',
        desc: '入门款，适合体育课和平时娱乐。送3个球和手胶。',
        price: 120,
        originalPrice: 280,
        categoryId: 5,
        categoryName: '运动户外',
        cover: '/images/goods/racket1.png',
        images: ['/images/goods/racket1.png'],
        seller: { id: 4, name: '体育-赵六', avatar: '/images/avatar4.png', school: '体育学院', grade: '2022级', verified: true },
        status: 'published',
        viewCount: 156,
        favCount: 12,
        publishTime: '2026-06-24 16:45',
        condition: '七成新',
        tradePlace: '体育馆'
      },
      {
        id: 6,
        title: '代购南门小吃街烤冷面',
        desc: '每周二四代购南门烤冷面，满15元免费送到宿舍楼下。加微信下单备注口味。',
        price: 8,
        originalPrice: 10,
        categoryId: 6,
        categoryName: '零食代购',
        cover: '/images/goods/food1.png',
        images: ['/images/goods/food1.png'],
        seller: { id: 5, name: '经管-孙七', avatar: '/images/avatar5.png', school: '经济管理学院', grade: '2023级', verified: true },
        status: 'published',
        viewCount: 892,
        favCount: 103,
        publishTime: '2026-06-23 11:00',
        condition: '全新',
        tradePlace: '各宿舍楼下'
      },
      {
        id: 7,
        title: 'Python编程一对一辅导',
        desc: 'ACM省赛银牌，可辅导Python基础、数据结构、LeetCode刷题。50元/小时，图书馆面授。',
        price: 50,
        originalPrice: 100,
        categoryId: 7,
        categoryName: '技能服务',
        cover: '/images/goods/tutor1.png',
        images: ['/images/goods/tutor1.png'],
        seller: { id: 1, name: '计算机-张三', avatar: '/images/avatar1.png', school: '信息工程学院', grade: '2022级', verified: true },
        status: 'published',
        viewCount: 345,
        favCount: 56,
        publishTime: '2026-06-22 08:30',
        condition: '全新',
        tradePlace: '图书馆'
      },
      {
        id: 8,
        title: '吉他 雅马哈F310 入门款',
        desc: '学了一个月放弃了，几乎全新。送调音器、变调夹、琴包。',
        price: 450,
        originalPrice: 799,
        categoryId: 8,
        categoryName: '其他闲置',
        cover: '/images/goods/guitar1.png',
        images: ['/images/goods/guitar1.png'],
        seller: { id: 2, name: '设计-李四', avatar: '/images/avatar2.png', school: '艺术学院', grade: '2023级', verified: true },
        status: 'published',
        viewCount: 178,
        favCount: 23,
        publishTime: '2026-06-21 19:00',
        condition: '九九新',
        tradePlace: '艺术楼大厅'
      }
    ];
    this.globalData.goodsList = goodsList;

    const announcements = [
      { id: 1, title: '【公告】毕业季专场——大四学长学姐清仓特卖', date: '2026-06-25', type: 'hot' },
      { id: 2, title: '【提醒】交易请选择校内公共场所，谨防诈骗', date: '2026-06-20', type: 'notice' },
      { id: 3, title: '【活动】本周六跳蚤市场线下活动报名中', date: '2026-06-18', type: 'activity' }
    ];
    this.globalData.announcements = announcements;

    this.globalData.reports = [
      { id: 1, goodsId: 3, reason: '商品与描述不符', reporterId: 2, status: 'pending', time: '2026-06-27' },
      { id: 2, goodsId: 5, reason: '疑似校外商家', reporterId: 1, status: 'pending', time: '2026-06-26' }
    ];
  },

  // 检查本地登录状态
  checkLoginStatus() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const token = wx.getStorageSync('token');
      if (userInfo && token) {
        this.globalData.userInfo = userInfo;
        this.globalData.isLoggedIn = true;
        this.globalData.isVerified = userInfo.verified || false;
        this.globalData.isAdmin = userInfo.role === 'admin';
        console.log('[App] 恢复登录状态 - 用户ID:', userInfo.id, '昵称:', userInfo.nickname);
      } else {
        console.log('[App] 无本地登录状态，需要重新登录');
      }
      const favorites = wx.getStorageSync('favorites') || [];
      this.globalData.favorites = favorites;
      const myPosts = wx.getStorageSync('myPosts') || [];
      this.globalData.myPosts = myPosts;
      const orders = wx.getStorageSync('orders') || [];
      this.globalData.orders = orders;
    } catch (e) {
      console.error('读取缓存失败', e);
    }
  },

  // 保存登录状态
  saveLoginState(userInfo) {
    this.globalData.userInfo = userInfo;
    this.globalData.isLoggedIn = true;
    this.globalData.isVerified = userInfo.verified || false;
    this.globalData.isAdmin = userInfo.role === 'admin';
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('token', 'mock_token_' + Date.now());
    console.log('[App] 保存登录状态 - 用户ID:', userInfo.id, '昵称:', userInfo.nickname);
  },

  // 退出登录
  logout() {
    this.globalData.userInfo = null;
    this.globalData.isLoggedIn = false;
    this.globalData.isVerified = false;
    this.globalData.isAdmin = false;
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
  },

  // 切换收藏
  toggleFavorite(goodsId) {
    const idx = this.globalData.favorites.indexOf(goodsId);
    if (idx > -1) {
      this.globalData.favorites.splice(idx, 1);
    } else {
      this.globalData.favorites.push(goodsId);
    }
    wx.setStorageSync('favorites', this.globalData.favorites);
    return idx === -1; // true=已收藏, false=已取消
  },

  // 是否已收藏
  isFavorited(goodsId) {
    return this.globalData.favorites.indexOf(goodsId) > -1;
  },

  // 获取收藏商品列表
  getFavoriteGoods() {
    return this.globalData.goodsList.filter(g => this.globalData.favorites.includes(g.id));
  },

  // 获取当前用户发布的商品（从全局数据中筛选，用于降级场景）
  getMyPosts() {
    if (!this.globalData.userInfo) return [];
    const userId = String(this.globalData.userInfo.id);
    return this.globalData.goodsList.filter(g => String(g.seller.id) === userId);
  },

  // ========== 订单相关 ==========

  // 保存订单到本地缓存
  saveOrders() {
    wx.setStorageSync('orders', this.globalData.orders);
  },

  // 获取买家订单（我买到的）
  getBuyerOrders() {
    if (!this.globalData.userInfo) return [];
    return this.globalData.orders.filter(o => o.buyerId === this.globalData.userInfo.id);
  },

  // 获取单个订单
  getOrderById(orderId) {
    return this.globalData.orders.find(o => o.orderId === orderId);
  },

  // 更新订单状态
  updateOrderStatus(orderId, status) {
    const order = this.globalData.orders.find(o => o.orderId === orderId);
    if (order) {
      order.status = status;
      this.saveOrders();
      return true;
    }
    return false;
  },

  // 获取订单状态文本
  getOrderStatusText(status) {
    const map = {
      'pending': '待确认',
      'confirmed': '已确认',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return map[status] || status;
  },

  // 初始化模拟订单数据
  initMockOrders() {
    if (this.globalData.orders.length > 0) return;
    if (!this.globalData.userInfo) return;
    const uid = this.globalData.userInfo.id;
    const goodsList = this.globalData.goodsList;
    const now = Date.now();
    const mockOrders = [
      {
        orderId: 'OD' + (now - 86400000 * 2) + '01',
        productId: goodsList[0] ? goodsList[0].id : 1,
        productTitle: goodsList[0] ? goodsList[0].title : '《数据结构》严蔚敏 全新正版',
        productImage: goodsList[0] ? (goodsList[0].images[0] || goodsList[0].cover) : '/images/goods/book1.png',
        categoryName: '教材教辅',
        price: 25,
        buyerId: uid,
        buyerName: this.globalData.userInfo.nickname,
        buyerContact: this.globalData.userInfo.contact || this.globalData.userInfo.phone || '',
        sellerId: goodsList[0] ? goodsList[0].seller.id : 1,
        sellerName: goodsList[0] ? goodsList[0].seller.name : '计算机-张三',
        sellerContact: '138xxxx0001',
        tradeLocation: goodsList[0] ? (goodsList[0].tradePlace || '图书馆门口') : '图书馆门口',
        remark: '',
        status: 'completed',
        createTime: this.formatTime(new Date(now - 86400000 * 2))
      },
      {
        orderId: 'OD' + (now - 86400000) + '02',
        productId: goodsList[1] ? goodsList[1].id : 2,
        productTitle: goodsList[1] ? goodsList[1].title : 'iPad Air 5 64G 星空灰 在保',
        productImage: goodsList[1] ? (goodsList[1].images[0] || goodsList[1].cover) : '/images/goods/ipad1.png',
        categoryName: '电子产品',
        price: 3200,
        buyerId: uid,
        buyerName: this.globalData.userInfo.nickname,
        buyerContact: this.globalData.userInfo.contact || this.globalData.userInfo.phone || '',
        sellerId: goodsList[1] ? goodsList[1].seller.id : 2,
        sellerName: goodsList[1] ? goodsList[1].seller.name : '设计-李四',
        sellerContact: '138xxxx0002',
        tradeLocation: goodsList[1] ? (goodsList[1].tradePlace || '二食堂门口') : '二食堂门口',
        remark: '请带充电器',
        status: 'pending',
        createTime: this.formatTime(new Date(now - 86400000))
      }
    ];
    this.globalData.orders = mockOrders;
    this.saveOrders();
  },

  // 格式化时间
  formatTime(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  }

});
