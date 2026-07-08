// 图书馆座位预约 - 模拟数据，正式上线需接入学校图书馆系统
const { libraryData } = require('../../data/campusServices');

Page({
  data: {
    campuses: libraryData.campuses,
    floors: libraryData.floors,
    timeSlots: libraryData.timeSlots,
    selectedCampus: 'shahe',
    selectedFloor: 'f1',
    selectedSlot: 't1',
    selectedDate: '',
    seats: [],
    selectedSeat: null,
    showResult: false,
    reservationInfo: null
  },

  onLoad() {
    const today = this._formatDate(new Date());
    this.setData({ selectedDate: today });
    this._loadSeats();
  },

  _formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  _loadSeats() {
    const seats = libraryData.generateSeats(this.data.selectedFloor);
    this.setData({ seats, selectedSeat: null, showResult: false });
  },

  onCampusChange(e) {
    this.setData({ selectedCampus: e.currentTarget.dataset.id });
    this._loadSeats();
  },

  onFloorChange(e) {
    this.setData({ selectedFloor: e.currentTarget.dataset.id });
    this._loadSeats();
  },

  onSlotChange(e) {
    this.setData({ selectedSlot: e.currentTarget.dataset.id });
  },

  onDateChange(e) {
    this.setData({ selectedDate: e.detail.value });
  },

  onSeatTap(e) {
    const id = e.currentTarget.dataset.id;
    const seat = this.data.seats.find(s => s.id === id);
    if (!seat || seat.status !== 'available') {
      wx.showToast({ title: seat && seat.status === 'booked' ? '该座位已被预约' : '该座位维修中', icon: 'none' });
      return;
    }
    this.setData({ selectedSeat: id, showResult: false });
  },

  onConfirm() {
    if (!this.data.selectedSeat) {
      wx.showToast({ title: '请先选择一个座位', icon: 'none' });
      return;
    }
    const seat = this.data.seats.find(s => s.id === this.data.selectedSeat);
    if (!seat) return;

    const campus = this.data.campuses.find(c => c.id === this.data.selectedCampus);
    const floor = this.data.floors.find(f => f.id === this.data.selectedFloor);
    const slot = this.data.timeSlots.find(t => t.id === this.data.selectedSlot);

    wx.showModal({
      title: '确认预约',
      content: `场馆：${campus ? campus.name : ''}\n楼层：${floor ? floor.name : ''}\n座位：${seat.label}\n时间：${this.data.selectedDate} ${slot ? slot.label : ''}`,
      confirmText: '确认预约',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            showResult: true,
            reservationInfo: {
              campus: campus ? campus.name : '',
              floor: floor ? floor.name : '',
              seat: seat.label,
              date: this.data.selectedDate,
              time: slot ? slot.label : '',
              code: 'LIB' + Date.now().toString(36).toUpperCase()
            }
          });
        }
      }
    });
  }
});
