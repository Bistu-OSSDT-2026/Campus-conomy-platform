const app = getApp();

Page({
  data: {
    orders: []
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const orders = app.getBuyerOrders();
    // 为每个订单附加状态文本
    const enriched = orders.map(o => ({
      ...o,
      statusText: app.getOrderStatusText(o.status)
    }));
    this.setData({ orders: enriched });
  },

  // 点击订单卡片 → 查看详情
  onOrderTap(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/order-detail/order-detail?orderId=${orderId}` });
  },

  // 取消订单
  onCancelOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          app.updateOrderStatus(orderId, 'cancelled');
          this.loadData();
          wx.showToast({ title: '订单已取消', icon: 'success' });
        }
      }
    });
  },

  // 去逛逛
  onGoHome() {
    wx.switchTab({ url: '/pages/home/home' });
  }
});
