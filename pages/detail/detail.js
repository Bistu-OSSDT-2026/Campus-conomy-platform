const app = getApp();
const defaultProducts = require('../../data/defaultProducts');

Page({
  data: {
    goods: null,
    isFavorited: false,
    showContactModal: false,
    showReportModal: false,
    reportReason: '',
    showSellerContact: true,
    sellerContactInfo: '',
    reportReasons: [
      '商品与描述不符',
      '价格虚高/虚假标价',
      '假冒伪劣商品',
      '疑似校外商家',
      '违禁品/违规内容',
      '骚扰/诈骗行为',
      '其他原因'
    ]
  },

  onLoad(options) {
    const id = options.id;
    console.log('详情页接收到商品 id：', id);

    if (!id) {
      this.setData({ goods: null });
      return;
    }

    // 检查是否已被删除
    try {
      const deletedIds = (wx.getStorageSync('deletedProductIds') || []).map(String);
      if (deletedIds.includes(String(id))) {
        console.log('详情页：该商品已被删除, id:', id);
        this.setData({ goods: null });
        return;
      }
    } catch (e) {}

    // 1. 先从 globalData.goodsList 查找（字符串比较，兼容 local_xxx）
    let goods = app.globalData.goodsList.find(g => String(g.id) === String(id));

    // 2. 再从 localProducts 缓存查找
    if (!goods) {
      try {
        const localProducts = wx.getStorageSync('localProducts') || [];
        const localP = localProducts.find(p => String(p.id) === String(id));
        if (localP) {
          console.log('详情页从本地缓存找到商品：', localP.title);
          goods = this._localToDetail(localP);
        }
      } catch (e) {}
    }

    // 3. 默认商品兜底查找
    if (!goods) {
      const defaultP = defaultProducts.find(p => String(p.id) === String(id));
      if (defaultP) {
        console.log('详情页从默认商品找到：', defaultP.title);
        goods = this._localToDetail(defaultP);
      }
    }

    // 4. 后端兜底查找
    if (!goods) {
      console.log('详情页本地未找到，尝试后端查询 GET /api/products/' + id);
      wx.request({
        url: 'http://127.0.0.1:3000/api/products/' + id,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.code === 200 && res.data.data) {
            const serverP = res.data.data;
            console.log('详情页后端找到商品：', serverP.title);
            const found = this._serverToDetail(serverP);
            found.viewCount = (found.viewCount || 0) + 1;
            this.setData({ goods: found, isFavorited: app.isFavorited(found.id) });
            console.log('详情页找到的商品：', found);
          } else {
            this.setData({ goods: null });
          }
        },
        fail: () => {
          this.setData({ goods: null });
        }
      });
      return;
    }

    // 找到商品
    goods.viewCount = (goods.viewCount || 0) + 1;
    this.setData({ goods, isFavorited: app.isFavorited(goods.id) });
    console.log('详情页找到的商品：', goods);
  },

  // 本地缓存商品 → 详情页格式
  _localToDetail(p) {
    // 图片兜底
    let images = [];
    if (p.images && p.images.length > 0) {
      images = p.images;
    } else if (p.cover) {
      images = [p.cover];
    } else {
      images = ['/images/goods-default.png'];
    }

    return {
      id: p.id,
      title: p.title,
      desc: p.description || '',
      price: p.price,
      originalPrice: 0,
      categoryId: 0,
      categoryName: p.category || '',
      images: images,
      cover: images[0],
      seller: {
        id: p.publisherId || 'u001',
        name: p.publisherName || '吕泽卿',
        avatar: p.publisherAvatar || '/images/avatar/lvzeqing.jpg',
        school: p.school || '北京信息科技大学',
        grade: p.grade || '',
        verified: true
      },
      // 状态：不存在或不是"已下架"都视为在售
      status: (p.status === '已下架') ? 'removed' : 'published',
      type: p.type || 'sell',
      condition: p.condition || '',
      tradePlace: p.tradeLocation || '校内面交',
      contact: p.contact || '',
      viewCount: p.views || 0,
      favCount: p.favoriteCount || 0,
      publishTime: p.createdAt || '',
      createdAt: p.createdAt || ''
    };
  },

  // 后端商品 → 详情页格式
  _serverToDetail(p) {
    let images = [];
    if (p.images && p.images.length > 0) {
      images = p.images;
    } else if (p.cover) {
      images = [p.cover];
    } else {
      images = ['/images/goods-default.png'];
    }

    return {
      id: p.id,
      title: p.title,
      desc: p.description || '',
      price: p.price,
      originalPrice: p.originalPrice || 0,
      categoryId: p.categoryId || 0,
      categoryName: p.category || '',
      images: images,
      cover: images[0],
      seller: {
        id: p.publisherId,
        name: p.publisherName,
        avatar: p.publisherAvatar || '/images/avatar1.png',
        school: p.school || '',
        grade: p.grade || '',
        verified: true
      },
      status: (p.status === '已下架') ? 'removed' : 'published',
      type: p.type || 'sell',
      condition: p.condition || '',
      tradePlace: p.tradeLocation || '',
      contact: p.contact || '',
      viewCount: p.views || 0,
      favCount: p.favoriteCount || 0,
      publishTime: p.createdAt || '',
      createdAt: p.createdAt || ''
    };
  },

  onShow() {
    if (this.data.goods) {
      this.setData({ isFavorited: app.isFavorited(this.data.goods.id) });
    }
  },

  // 预览图片
  onPreviewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.goods.images[index],
      urls: this.data.goods.images
    });
  },

  // 收藏
  onToggleFavorite() {
    if (!app.globalData.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    const favorited = app.toggleFavorite(this.data.goods.id);
    this.setData({ isFavorited: favorited });
    if (favorited) {
      this.data.goods.favCount++;
      wx.showToast({ title: '已收藏', icon: 'success' });
    } else {
      this.data.goods.favCount = Math.max(0, this.data.goods.favCount - 1);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    }
  },

  // 联系卖家
  onContactSeller() {
    if (!app.globalData.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    if (!app.globalData.isVerified) {
      wx.showModal({
        title: '需要认证',
        content: '联系卖家需要先完成校园认证',
        confirmText: '去认证',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/verify/verify' });
          }
        }
      });
      return;
    }

    // 检查卖家隐私设置：是否公开联系方式
    const sellerId = this.data.goods.seller.id;
    const sellerUserInfo = wx.getStorageSync('userInfo');
    const privacy = wx.getStorageSync('privacySettings') || {};

    let showContact = true;
    let contactInfo = '';

    // 如果当前浏览的商品发布者就是当前登录用户自己，则始终显示
    if (sellerUserInfo && sellerUserInfo.id === sellerId) {
      showContact = true;
      contactInfo = sellerUserInfo.contact || sellerUserInfo.phone || '';
    } else {
      // 查找卖家的联系方式（从goods数据中）
      contactInfo = this.data.goods.contact || '';
      // 如果卖家关闭了公开联系方式
      if (privacy.showContact === false) {
        showContact = false;
      }
    }

    this.setData({
      showContactModal: true,
      showSellerContact: showContact,
      sellerContactInfo: contactInfo
    });
  },

  onCloseModal() {
    this.setData({ showContactModal: false });
  },

  // 分享
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 举报
  onShowReport() {
    if (!app.globalData.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    this.setData({ showReportModal: true, reportReason: '' });
  },

  onSelectReason(e) {
    this.setData({ reportReason: e.currentTarget.dataset.reason });
  },

  onSubmitReport() {
    if (!this.data.reportReason) {
      wx.showToast({ title: '请选择举报原因', icon: 'none' });
      return;
    }
    // 添加举报记录
    app.globalData.reports.push({
      id: Date.now(),
      goodsId: this.data.goods.id,
      reason: this.data.reportReason,
      reporterId: app.globalData.userInfo ? app.globalData.userInfo.id : 0,
      status: 'pending',
      time: new Date().toISOString().split('T')[0]
    });

    this.setData({ showReportModal: false });
    wx.showToast({ title: '举报已提交，管理员会尽快处理', icon: 'success' });
  },

  onCloseReport() {
    this.setData({ showReportModal: false, reportReason: '' });
  },

  onGoBack() {
    wx.switchTab({ url: '/pages/home/home' });
  },

  // 分享配置
  onShareAppMessage() {
    return {
      title: this.data.goods ? this.data.goods.title : '校园经济',
      path: `/pages/detail/detail?id=${this.data.goods ? this.data.goods.id : ''}`
    };
  }
});
