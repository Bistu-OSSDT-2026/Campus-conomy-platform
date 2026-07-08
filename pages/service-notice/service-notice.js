// 重要通知 - 模拟数据，正式上线需接入学校官方通知源
const { notificationData } = require('../../data/campusServices');

Page({
  data: {
    categories: notificationData.categories,
    notices: notificationData.notices,
    selectedCategory: 'all',
    filteredNotices: [],
    showDetail: false,
    detailNotice: null
  },

  onLoad() {
    this._filter();
  },

  onCategoryTap(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.id });
    this._filter();
  },

  _filter() {
    const cat = this.data.selectedCategory;
    const filtered = cat === 'all'
      ? this.data.notices
      : this.data.notices.filter(n => n.category === cat);
    this.setData({ filteredNotices: filtered });
  },

  onNoticeTap(e) {
    const id = e.currentTarget.dataset.id;
    const n = this.data.notices.find(x => x.id === id);
    if (n) this.setData({ showDetail: true, detailNotice: n });
  },

  onCloseDetail() {
    this.setData({ showDetail: false, detailNotice: null });
  }
});
