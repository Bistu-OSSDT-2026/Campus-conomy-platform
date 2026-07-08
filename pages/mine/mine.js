const app = getApp();

Page({
  data: {
    isLoggedIn: false,
    isAdmin: false,
    userInfo: null,
    myPostsCount: 0,
    favoritesCount: 0,
    myOrdersCount: 0
  },

  onShow() {
    this.refreshData();
  },

  refreshData() {
    const isLoggedIn = app.globalData.isLoggedIn;
    const userId = app.globalData.userInfo ? app.globalData.userInfo.id : -1;
    console.log('[我的页面] 当前登录用户:', JSON.stringify(app.globalData.userInfo));
    // 初始化模拟订单（仅首次）
    if (isLoggedIn && app.globalData.orders.length === 0) {
      app.initMockOrders();
    }
    const myOrdersCount = app.globalData.orders.filter(o =>
      o.buyerId === userId
    ).length;

    // 基础信息先设置（不包含需要后端请求的数据）
    this.setData({
      isLoggedIn: isLoggedIn,
      isAdmin: app.globalData.isAdmin,
      userInfo: app.globalData.userInfo,
      myPostsCount: 0, // 先设为0，等后端返回再更新
      favoritesCount: app.globalData.favorites.length,
      myOrdersCount: myOrdersCount
    });

    // 从后端获取我的发布数量（myPostsCount）
    if (isLoggedIn && userId) {
      wx.request({
        url: `http://127.0.0.1:3000/api/users/${userId}/products`,
        method: 'GET',
        success: (res) => {
          console.log('[我的页面] 后端返回我的发布:', JSON.stringify(res.data));
          if (res.statusCode === 200 && res.data && res.data.code === 200) {
            const myProducts = res.data.data || [];
            console.log('[我的页面] 我的发布商品列表:', JSON.stringify(myProducts.map(p => p.title)));
            this.setData({ myPostsCount: myProducts.length });
          } else {
            // 后端异常，回退到本地数据
            const localCount = app.globalData.goodsList.filter(g =>
              String(g.seller.id) === String(userId)
            ).length;
            this.setData({ myPostsCount: localCount });
          }
        },
        fail: (err) => {
          console.error('[我的页面] 网络请求失败:', JSON.stringify(err));
          // 网络失败，回退到本地数据
          const localCount = app.globalData.goodsList.filter(g =>
            String(g.seller.id) === String(userId)
          ).length;
          this.setData({ myPostsCount: localCount });
        }
      });
    }
  },

  onGoLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  onGoVerify() {
    wx.navigateTo({ url: '/pages/verify/verify' });
  },

  onEditProfile() {
    if (!app.globalData.isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  onGoMyPosts() {
    if (!app.globalData.isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/my-posts/my-posts' });
  },

  onGoMyOrders() {
    if (!app.globalData.isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/my-orders/my-orders' });
  },

  onGoMyFavorites() {
    if (!app.globalData.isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/my-favorites/my-favorites' });
  },

  onGoAdmin() {
    wx.navigateTo({ url: '/pages/admin/admin' });
  },

  onGoReports() {
    if (!app.globalData.isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/my-reports/my-reports' });
  },

  onGoSettings() {
    if (!app.globalData.isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  onGoAgreement() {
    wx.navigateTo({ url: '/pages/agreement/agreement' });
  },

  onGoOpensource() {
    wx.navigateTo({ url: '/pages/opensource/opensource' });
  },

  onAbout() {
    wx.showModal({
      title: '关于校园经济',
      content: 'CampusMarket v1.0.0\n\n开源校园交易平台\n基于 AGPL-3.0 协议开源\n\n让每个学校都能拥有自己的校园交易平台',
      showCancel: false
    });
  },

  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢你的反馈！\n\n请通过 GitHub Issues 提交：\nhttps://github.com/your-org/campus-market/issues',
      showCancel: false
    });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
          this.refreshData();
          wx.showToast({ title: '已退出', icon: 'success' });
          setTimeout(() => {
            wx.redirectTo({ url: '/pages/login/login' });
          }, 800);
        }
      }
    });
  }
});
