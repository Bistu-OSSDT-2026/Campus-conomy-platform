const app = getApp();

Page({
  data: {
    goodsList: []
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const goodsList = app.getFavoriteGoods();
    this.setData({ goodsList });
  },

  onGoodsTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  onUnfavorite(e) {
    const id = e.currentTarget.dataset.id;
    app.toggleFavorite(id);
    this.loadData();
    wx.showToast({ title: '已取消收藏', icon: 'none' });
  },

  onGoHome() {
    wx.switchTab({ url: '/pages/home/home' });
  }
});
