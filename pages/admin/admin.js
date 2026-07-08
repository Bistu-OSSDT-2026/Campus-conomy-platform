const app = getApp();

Page({
  data: {
    isAdmin: false,
    activeTab: 'goods',
    totalGoods: 0,
    pendingReports: 0,
    totalUsers: 0,
    totalViews: 0,
    allGoods: [],
    reports: []
  },

  onLoad() {
    if (!app.globalData.isAdmin) {
      this.setData({ isAdmin: false });
      return;
    }
    this.setData({ isAdmin: true });
    this.loadData();
  },

  onShow() {
    if (app.globalData.isAdmin) {
      this.setData({ isAdmin: true });
      this.loadData();
    }
  },

  loadData() {
    const allGoods = app.globalData.goodsList || [];
    const reports = (app.globalData.reports || []).filter(r => r.status === 'pending');
    const totalViews = allGoods.reduce((sum, g) => sum + (g.viewCount || 0), 0);

    this.setData({
      totalGoods: allGoods.length,
      pendingReports: reports.length,
      totalUsers: 6, // 模拟用户数
      totalViews: totalViews,
      allGoods: allGoods,
      reports: reports
    });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  // 下架商品
  onOfflineGoods(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认下架',
      content: '确定要下架该商品吗？',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          const goods = app.globalData.goodsList.find(g => g.id === id);
          if (goods) {
            goods.status = 'offline';
            this.loadData();
            wx.showToast({ title: '已下架', icon: 'success' });
          }
        }
      }
    });
  },

  // 上架商品
  onOnlineGoods(e) {
    const id = e.currentTarget.dataset.id;
    const goods = app.globalData.goodsList.find(g => g.id === id);
    if (goods) {
      goods.status = 'published';
      this.loadData();
      wx.showToast({ title: '已上架', icon: 'success' });
    }
  },

  // 处理举报
  onHandleReport(e) {
    const { id, action } = e.currentTarget.dataset;
    const actionLabels = {
      remove: '下架商品',
      dismiss: '驳回举报',
      ban: '封禁用户'
    };
    const actionLabel = actionLabels[action] || '处理';

    wx.showModal({
      title: '确认操作',
      content: `确定要${actionLabel}吗？`,
      confirmColor: action !== 'dismiss' ? '#FF4D4F' : '#2F6BFF',
      success: (res) => {
        if (res.confirm) {
          const report = app.globalData.reports.find(r => r.id === id);
          if (report) {
            report.status = 'resolved';
            report.result = action;
            report.resolveTime = new Date().toISOString().split('T')[0];

            // 如果是下架商品
            if (action === 'remove') {
              const goods = app.globalData.goodsList.find(g => g.id === report.goodsId);
              if (goods) goods.status = 'offline';
            }
            // 如果是封禁用户
            if (action === 'ban') {
              wx.showToast({ title: '已封禁相关用户（模拟）', icon: 'success' });
            }

            this.loadData();
            wx.showToast({ title: `${actionLabel}成功`, icon: 'success' });
          }
        }
      }
    });
  },

  onGoBack() {
    wx.switchTab({ url: '/pages/mine/mine' });
  }
});
