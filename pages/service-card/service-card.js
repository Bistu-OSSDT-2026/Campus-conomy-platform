// 校园卡服务 - 模拟数据，正式上线需接入学校官方平台
const { cardData } = require('../../data/campusServices');

Page({
  data: {
    balance: cardData.balance,
    todaySpent: cardData.todaySpent,
    monthSpent: cardData.monthSpent,
    records: cardData.records,
    showBalance: false,
    showRecharge: false,
    showLost: false,
    rechargeAmount: '',
    showRecords: false
  },

  // 余额查询
  onShowBalance() {
    this.setData({ showBalance: true });
  },

  onCloseBalance() {
    this.setData({ showBalance: false });
  },

  // 在线充值
  onShowRecharge() {
    this.setData({ showRecharge: true, rechargeAmount: '' });
  },

  onInputAmount(e) {
    this.setData({ rechargeAmount: e.detail.value });
  },

  onQuickAmount(e) {
    this.setData({ rechargeAmount: e.currentTarget.dataset.amount });
  },

  onConfirmRecharge() {
    const amount = parseFloat(this.data.rechargeAmount);
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }
    this.setData({ showRecharge: false });
    wx.showToast({ title: '充值申请已提交（模拟）', icon: 'success' });
  },

  onCloseRecharge() {
    this.setData({ showRecharge: false, rechargeAmount: '' });
  },

  // 挂失
  onShowLost() {
    wx.showModal({
      title: '挂失校园卡',
      content: '确认挂失校园卡？挂失后卡片将暂时无法使用。',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '挂失申请已提交（模拟）', icon: 'success' });
        }
      }
    });
  },

  // 消费记录
  onShowRecords() {
    this.setData({ showRecords: true });
  },

  onCloseRecords() {
    this.setData({ showRecords: false });
  }
});
