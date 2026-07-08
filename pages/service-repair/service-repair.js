// 宿舍报修 - 模拟数据，正式上线需接入学校后勤系统
const { repairTypes } = require('../../data/campusServices');

Page({
  data: {
    types: repairTypes,
    selectedType: '',
    building: '',
    room: '',
    description: '',
    images: [],
    submitted: false,
    repairId: ''
  },

  onTypeTap(e) {
    this.setData({ selectedType: e.currentTarget.dataset.id });
  },

  onInput(e) {
    const f = e.currentTarget.dataset.field;
    this.setData({ [f]: e.detail.value });
  },

  onChooseImage() {
    const that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const imgs = that.data.images.concat(res.tempFilePaths).slice(0, 3);
        that.setData({ images: imgs });
      }
    });
  },

  onRemoveImage(e) {
    const idx = e.currentTarget.dataset.idx;
    const imgs = this.data.images.filter((_, i) => i !== idx);
    this.setData({ images: imgs });
  },

  onSubmit() {
    if (!this.data.selectedType) {
      wx.showToast({ title: '请选择报修类型', icon: 'none' });
      return;
    }
    if (!this.data.building.trim()) {
      wx.showToast({ title: '请输入宿舍楼号', icon: 'none' });
      return;
    }
    if (!this.data.room.trim()) {
      wx.showToast({ title: '请输入宿舍号', icon: 'none' });
      return;
    }
    if (!this.data.description.trim()) {
      wx.showToast({ title: '请描述问题', icon: 'none' });
      return;
    }

    const type = this.data.types.find(t => t.id === this.data.selectedType);
    this.setData({
      submitted: true,
      repairId: 'R' + Date.now().toString(36).toUpperCase(),
      selectedTypeName: type ? type.name : ''
    });
  }
});
