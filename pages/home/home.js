const app = getApp();
const defaultProducts = require('../../data/defaultProducts');

// 首页精选显示（4核心分类 + 全部分类）
const homeCategoriesTemplate = [
  { id: 1, name: '教材教辅', icon: '📚', color: '#2F6BFF' },
  { id: 2, name: '电子产品', icon: '💻', color: '#FF6B6B' },
  { id: 3, name: '生活用品', icon: '🏠', color: '#51CF66' },
  { id: 7, name: '技能服务', icon: '🎓', color: '#20C997' },
  { id: 0, name: '全部分类', icon: '🔍', color: '#868E96' }
];

// 首页校园服务入口（2行×4列，共8个服务）
// 当前为课程展示模拟数据，正式上线需接入学校官方接口
const featuredServices = [
  { id: 'library', name: '图书馆预约', icon: '📚', page: '/pages/service-library/service-library' },
  { id: 'classroom', name: '空教室查询', icon: '🏫', page: '/pages/service-classroom/service-classroom' },
  { id: 'schedule', name: '我的课表', icon: '📅', page: '/pages/service-schedule/service-schedule' },
  { id: 'notifications', name: '重要通知', icon: '📢', page: '/pages/service-notice/service-notice' },
  { id: 'activity', name: '活动比赛', icon: '🏆', page: '/pages/service-activity/service-activity' },
  { id: 'lecture', name: '讲座报名', icon: '🎤', page: '/pages/service-activity/service-activity?cat=lecture' },
  { id: 'card', name: '校园卡服务', icon: '💳', page: '/pages/service-card/service-card' },
  { id: 'repair', name: '宿舍报修', icon: '🔧', page: '/pages/service-repair/service-repair' }
];

Page({
  data: {
    homeCategories: homeCategoriesTemplate,
    announcements: [],
    goodsList: [],
    searchKeyword: '',
    featuredServices: featuredServices,
    ads: [
      {
        id: 'ad001',
        title: '期末资料打印 低至0.1元/页',
        subtitle: '论文、课件、复习资料，校内自取更方便',
        tag: '校内商家',
        buttonText: '立即查看',
        bgColor: 'blue',
        icon: '🖨️',
        type: 'print'
      },
      {
        id: 'ad002',
        title: '学生认证 奶茶第二杯半价',
        subtitle: '复习累了来一杯，沙河校区今日专享',
        tag: '限时福利',
        buttonText: '领取优惠',
        bgColor: 'milkTea',
        icon: '🧋',
        type: 'milkTea'
      },
      {
        id: 'ad003',
        title: '手机电脑维修 校内快速响应',
        subtitle: '屏幕、电池、系统问题，学生价更省心',
        tag: '数码服务',
        buttonText: '预约咨询',
        bgColor: 'cyan',
        icon: '🔧',
        type: 'repair'
      },
      {
        id: 'ad004',
        title: '快递太远？跑腿5元起',
        subtitle: '取快递、带饭、送资料，认证同学更安心',
        tag: '校园服务',
        buttonText: '马上下单',
        bgColor: 'green',
        icon: '📦',
        type: 'errand'
      }
    ]
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    const appData = app.globalData;
    this.setData({
      announcements: appData.announcements || []
    });

    // 从后端获取商品列表
    wx.request({
      url: 'http://127.0.0.1:3000/api/products',
      method: 'GET',
      success: (res) => {
        console.log('[首页] 后端原始响应:', res.statusCode, (res.data && res.data.data) ? res.data.data.length : 0, '条');
        let serverProducts = [];
        if (res.statusCode === 200 && res.data && res.data.code === 200) {
          serverProducts = res.data.data || [];
        }

        // 合并后端 + 本地 localProducts
        this._renderGoodsList(serverProducts);
      },
      fail: () => {
        console.log('[首页] 后端请求失败，使用本地数据');
        this._renderGoodsList([]);
      }
    });
  },

  _renderGoodsList(serverProducts) {
    const appData = app.globalData;

    // 读取本地缓存商品
    let localProducts = [];
    try {
      localProducts = wx.getStorageSync('localProducts') || [];
    } catch (e) {
      localProducts = [];
    }

    // 将后端商品转换为前端格式
    const serverGoods = serverProducts.map(p => ({
      id: p.id,
      title: p.title,
      desc: p.description || '',
      price: p.price,
      originalPrice: p.originalPrice || 0,
      categoryId: p.categoryId || 0,
      categoryName: p.category || '',
      images: p.images || [],
      cover: (p.images && p.images.length > 0) ? p.images[0] : '/images/goods-default.png',
      seller: {
        id: p.publisherId,
        name: p.publisherName,
        avatar: p.publisherAvatar || '/images/avatar1.png',
        school: p.school || '',
        verified: true
      },
      status: p.status === '在售' ? 'published' : (p.status === '已下架' ? 'removed' : 'completed'),
      type: p.type || 'sell',
      condition: p.condition || '',
      tradePlace: p.tradeLocation || '',
      contact: p.contact || '',
      viewCount: p.views || 0,
      favCount: p.favoriteCount || 0,
      publishTime: p.createdAt || '',
      createdAt: p.createdAt || ''
    }));

    // 将本地缓存商品转换为前端格式
    const localGoods = localProducts.map(p => ({
      id: p.id,
      title: p.title,
      desc: p.description || '',
      price: p.price,
      originalPrice: 0,
      categoryId: p.categoryId || 0,
      categoryName: p.category || '',
      images: p.images || [],
      cover: (p.images && p.images.length > 0) ? p.images[0] : '/images/goods-default.png',
      seller: {
        id: p.publisherId,
        name: p.publisherName,
        avatar: p.publisherAvatar || '/images/avatar1.png',
        school: p.school || '',
        verified: true
      },
      status: p.status === '在售' ? 'published' : (p.status === '已下架' ? 'removed' : 'completed'),
      type: formType(p),
      condition: p.condition || '',
      tradePlace: p.tradeLocation || '',
      contact: p.contact || '',
      viewCount: p.views || 0,
      favCount: p.favoriteCount || 0,
      publishTime: p.createdAt || '',
      createdAt: p.createdAt || ''
    }));

    function formType(p) { return 'sell'; }

    // 将默认商品转换为前端格式（始终参与合并，不只兜底）
    const defaultGoods = defaultProducts.map(p => ({
      id: p.id,
      title: p.title,
      desc: p.description || '',
      price: p.price,
      originalPrice: 0,
      categoryId: 0,
      categoryName: p.category || '',
      images: p.images || [],
      cover: (p.images && p.images.length > 0) ? p.images[0] : '/images/goods/book1.png',
      seller: {
        id: p.publisherId,
        name: p.publisherName,
        avatar: p.publisherAvatar || '/images/avatar1.png',
        school: p.school || '',
        verified: true
      },
      status: 'published',
      type: 'sell',
      condition: '',
      tradePlace: p.tradeLocation || '',
      contact: p.contact || '',
      viewCount: p.views || 0,
      favCount: p.favoriteCount || 0,
      publishTime: p.createdAt || '',
      createdAt: p.createdAt || ''
    }));

    // 用 Map 去重：local → server → default（优先级递减，同 id 保留先出现的）
    const mergedMap = new Map();
    localGoods.forEach(g => mergedMap.set(g.id, g));
    serverGoods.forEach(g => mergedMap.set(g.id, g));
    defaultGoods.forEach(g => { if (!mergedMap.has(g.id)) mergedMap.set(g.id, g); });

    console.log('首页三源合并：local=' + localGoods.length + ' server=' + serverGoods.length + ' default=' + defaultGoods.length + ' 去重后=' + mergedMap.size);

    // 读取已删除商品列表
    let deletedIds = [];
    try {
      deletedIds = (wx.getStorageSync('deletedProductIds') || []).map(String);
    } catch (e) {}

    // 过滤已删除 & 只显示在售，按 createdAt 倒序
    const allGoods = Array.from(mergedMap.values())
      .filter(g => !deletedIds.includes(String(g.id)));
    const publishedGoods = allGoods
      .filter(g => g.status === 'published')
      .sort((a, b) => {
        const tA = a.createdAt || '';
        const tB = b.createdAt || '';
        return tB.localeCompare(tA);
      });

    console.log('首页最终在售商品：', publishedGoods.length, '条');
    this.setData({ goodsList: publishedGoods });
    appData.goodsList = publishedGoods;
  },

  // 校园服务入口点击
  onServiceTap(e) {
    const item = e.currentTarget.dataset.item;
    if (!item || !item.page) return;
    wx.navigateTo({ url: item.page });
  },

  // 更多服务 → 完整校园服务页
  onMoreService() {
    wx.navigateTo({ url: '/pages/campus-services/campus-services' });
  },

  // 搜索
  onSearchTap() {
    wx.showModal({
      title: '搜索功能',
      content: '请输入搜索关键词（演示功能）',
      editable: true,
      placeholderText: '搜索商品...',
      success: (res) => {
        if (res.confirm && res.content) {
          const keyword = res.content.toLowerCase();
          const filtered = app.globalData.goodsList.filter(g =>
            g.title.toLowerCase().includes(keyword) ||
            g.desc.toLowerCase().includes(keyword) ||
            g.categoryName.includes(keyword)
          );
          this.setData({ goodsList: filtered });
          wx.showToast({ title: `找到${filtered.length}件商品`, icon: 'none' });
        }
      }
    });
  },

  // 分类点击
  onCategoryTap(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.switchTab({ url: '/pages/category/category' });
    if (id && id > 0) {
      wx.setStorageSync('activeCategory', { id, name });
    } else {
      wx.removeStorageSync('activeCategory');
    }
  },

  // 横幅点击
  onBannerTap() {
    wx.showToast({ title: '毕业季活动即将上线', icon: 'none' });
  },

  // 广告点击 - 弹出广告详情弹窗
  onAdTap(e) {
    const ad = e.currentTarget.dataset.ad;
    wx.showModal({
      title: ad.title,
      content: ad.subtitle,
      confirmText: '我知道了',
      showCancel: false,
      confirmColor: '#2F6BFF'
    });
  },

  // 公告点击
  onNoticeTap(e) {
    const id = e.currentTarget.dataset.id;
    const notice = app.globalData.announcements.find(n => n.id === id);
    if (notice) {
      wx.showModal({ title: '公告详情', content: notice.title, showCancel: false });
    }
  },

  onMoreNotice() {
    wx.navigateTo({ url: '/pages/service-notice/service-notice' });
  },

  onMoreGoods() {
    wx.switchTab({ url: '/pages/category/category' });
  },

  // 商品详情
  onGoodsTap(e) {
    const id = e.currentTarget.dataset.id;
    console.log('点击商品 id：', id);
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  }
});
