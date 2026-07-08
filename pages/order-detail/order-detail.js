const app = getApp();

Page({
  data: {
    order: null
  },

  onLoad(options) {
    const orderId = options.orderId;
    if (!orderId) {
      wx.showToast({ title: '订单不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1000);
      return;
    }
    const order = app.getOrderById(orderId);
    if (!order) {
      wx.showToast({ title: '订单不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1000);
      return;
    }
    this.setData({
      order: {
        ...order,
        statusText: app.getOrderStatusText(order.status)
      }
    });
  },

  // 取消订单
  onCancelOrder() {
    const order = this.data.order;
    if (!order || order.status !== 'pending') return;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          app.updateOrderStatus(order.orderId, 'cancelled');
          this.setData({
            order: {
              ...order,
              status: 'cancelled',
              statusText: app.getOrderStatusText('cancelled')
            }
          });
          wx.showToast({ title: '订单已取消', icon: 'success' });
        }
      }
    });
  }
});
