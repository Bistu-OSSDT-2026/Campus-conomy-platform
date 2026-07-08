// 快递代取 - 模拟数据，正式上线需接入快递系统
const { expressData } = require('../../data/campusServices');

Page({
  data: {
    stations: expressData.stations,
    selectedStation: '',
    pickupCode: '',
    deliveryAddr: '',
    phone: '',
    remark: '',
    basePrice: expressData.basePrice,
    orderSubmitted: false,
    orderId: ''
  },

  onStationTap(e) {
    this.setData({ selectedStation: e.currentTarget.dataset.id });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  onSubmit() {
    if (!this.data.selectedStation) {
      wx.showToast({ title: '请选择快递点', icon: 'none' });
      return;
    }
    if (!this.data.pickupCode.trim()) {
      wx.showToast({ title: '请输入取件码', icon: 'none' });
      return;
    }
    if (!this.data.deliveryAddr.trim()) {
      wx.showToast({ title: '请输入送达地点', icon: 'none' });
      return;
    }

    const orderId = 'EXP' + Date.now().toString(36).toUpperCase();
    this.setData({
      orderSubmitted: true,
      orderId: orderId
    });
  }
});
