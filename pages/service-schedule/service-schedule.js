// 我的课表 - 模拟数据，正式上线需接入学校教务系统
const { scheduleData } = require('../../data/campusServices');

Page({
  data: {
    weekdays: scheduleData.weekdays,
    courses: scheduleData.courses,
    currentWeek: 16,
    maxWeek: scheduleData.maxWeek,
    selectedDay: 0,
    todayCourses: [],
    showDetail: false,
    detailCourse: null
  },

  onLoad() {
    const d = new Date().getDay(); // 0=周日
    const dayIdx = d === 0 ? 6 : d - 1;
    this.setData({ selectedDay: dayIdx });
    this._filterCourses();
  },

  onWeekChange(e) {
    this.setData({ currentWeek: parseInt(e.detail.value) + 1 });
    this._filterCourses();
  },

  onDayTap(e) {
    const idx = parseInt(e.currentTarget.dataset.idx);
    this.setData({ selectedDay: idx });
    this._filterCourses();
  },

  _filterCourses() {
    const wd = this.data.selectedDay + 1; // 1-7
    const wk = this.data.currentWeek;
    const today = this.data.courses.filter(c => {
      if (c.weekday !== wd) return false;
      const parts = c.weeks.match(/(\d+)-(\d+)/);
      if (!parts) return true;
      const ws = parseInt(parts[1]), we = parseInt(parts[2]);
      return wk >= ws && wk <= we;
    }).sort((a, b) => a.time.localeCompare(b.time));
    this.setData({ todayCourses: today });
  },

  onCourseTap(e) {
    const id = e.currentTarget.dataset.id;
    const c = this.data.courses.find(x => x.id === id);
    if (c) this.setData({ showDetail: true, detailCourse: c });
  },

  onCloseDetail() {
    this.setData({ showDetail: false, detailCourse: null });
  }
});
