// 活动比赛 - 模拟数据，正式上线需接入学校活动平台
const { activityData } = require('../../data/campusServices');

Page({
  data: {
    categories: activityData.categories,
    activities: activityData.activities,
    selectedCategory: 'all',
    filteredActivities: [],
    enrolledIds: [],
    showDetail: false,
    detailActivity: null
  },

  onLoad(options) {
    // 支持从URL参数预筛选分类（如：讲座报名入口传入 cat=lecture）
    if (options && options.cat) {
      this.setData({ selectedCategory: options.cat });
    }
    this._filter();
  },

  onCategoryTap(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.id });
    this._filter();
  },

  _filter() {
    const cat = this.data.selectedCategory;
    const filtered = cat === 'all'
      ? this.data.activities
      : this.data.activities.filter(a => a.category === cat);
    this.setData({ filteredActivities: filtered });
  },

  onActivityTap(e) {
    const id = e.currentTarget.dataset.id;
    const a = this.data.activities.find(x => x.id === id);
    if (a) this.setData({ showDetail: true, detailActivity: a });
  },

  onCloseDetail() {
    this.setData({ showDetail: false, detailActivity: null });
  },

  onEnroll(e) {
    const id = e.currentTarget.dataset.id;
    const enrolledIds = this.data.enrolledIds;
    if (enrolledIds.indexOf(id) === -1) {
      enrolledIds.push(id);
      this.setData({ enrolledIds });
      wx.showToast({ title: '报名成功，后续请关注通知', icon: 'success' });
    } else {
      wx.showToast({ title: '已报名', icon: 'none' });
    }
  }
});
