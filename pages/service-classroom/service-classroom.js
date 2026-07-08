// 空教室查询 - 模拟数据，正式上线需接入学校教务系统
const { classroomData } = require('../../data/campusServices');

Page({
  data: {
    campuses: classroomData.campuses,
    buildings: classroomData.buildings,
    periods: classroomData.periods,
    selectedCampus: 'shahe',
    selectedBuilding: 'bldA',
    selectedPeriod: 'p1',
    selectedDate: '',
    rooms: [],
    hasQueried: false,
    showRoomDetail: false,
    currentRoom: null
  },

  onLoad() {
    const today = this._formatDate(new Date());
    this.setData({ selectedDate: today });
  },

  _formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  onCampusChange(e) {
    this.setData({ selectedCampus: e.currentTarget.dataset.id, hasQueried: false, rooms: [] });
  },

  onBuildingChange(e) {
    this.setData({ selectedBuilding: e.currentTarget.dataset.id, hasQueried: false, rooms: [] });
  },

  onPeriodChange(e) {
    this.setData({ selectedPeriod: e.currentTarget.dataset.id, hasQueried: false, rooms: [] });
  },

  onDateChange(e) {
    this.setData({ selectedDate: e.detail.value, hasQueried: false, rooms: [] });
  },

  onQuery() {
    const rooms = classroomData.getRoomsByBuilding(this.data.selectedBuilding, this.data.selectedPeriod);
    this.setData({ rooms, hasQueried: true });
  },

  onRoomTap(e) {
    const id = e.currentTarget.dataset.id;
    const room = this.data.rooms.find(r => r.id === id);
    if (room) {
      this.setData({ showRoomDetail: true, currentRoom: room });
    }
  },

  onCloseDetail() {
    this.setData({ showRoomDetail: false, currentRoom: null });
  },

  onAddPlan() {
    wx.showToast({ title: '已加入自习计划', icon: 'success' });
  }
});
