const app = getApp();
const beijingColleges = require('../../data/beijingColleges.js');

Page({
  data: {
    form: {
      nickname: '',
      school: '',
      campus: '',
      grade: '',
      major: '',
      studentId: '',
      contact: ''
    },
    campusList: ['主校区', '东校区', '西校区', '南校区', '北校区'],
    gradeList: ['2025级', '2024级', '2023级', '2022级', '2021级', '2020级', '研究生'],
    loading: false,

    // 学校搜索弹窗相关
    showSchoolPicker: false,
    schoolSearchKey: '',
    filteredSchoolList: [],
    showTypeLabel: true,
    schoolTypeLabel: ''
  },

  onLoad(options) {
    if (!app.globalData.isLoggedIn) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    // 预填已有信息
    const user = app.globalData.userInfo;
    if (user) {
      // 联系方式：优先使用注册时传递的 contact，其次用用户已有 contact
      const contactFromRegister = options.contact ? decodeURIComponent(options.contact) : '';
      this.setData({
        'form.nickname': user.nickname || '',
        'form.school': user.school || '',
        'form.campus': user.campus || '',
        'form.grade': user.grade || '',
        'form.major': user.major || '',
        'form.studentId': user.studentId || '',
        'form.contact': contactFromRegister || user.contact || ''
      });
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  // ========== 学校搜索弹窗 ==========

  // 打开学校选择弹窗
  onOpenSchoolPicker() {
    const keyword = this.data.schoolSearchKey || '';
    this.filterSchools(keyword);
    this.setData({ showSchoolPicker: true });
  },

  // 关闭弹窗
  onCloseSchoolPicker() {
    this.setData({
      showSchoolPicker: false,
      schoolSearchKey: ''
    });
  },

  // 搜索输入
  onSchoolSearch(e) {
    const keyword = e.detail.value;
    this.filterSchools(keyword);
    this.setData({ schoolSearchKey: keyword });
  },

  // 清除搜索
  onClearSchoolSearch() {
    this.filterSchools('');
    this.setData({ schoolSearchKey: '' });
  },

  // 筛选学校
  filterSchools(keyword) {
    let list = [];
    if (keyword && keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = beijingColleges.filter(item => item.name.toLowerCase().includes(kw));
      this.setData({ showTypeLabel: false, schoolTypeLabel: '' });
    } else {
      // 无关键词时按分类显示
      list = beijingColleges;
      this.setData({
        showTypeLabel: true,
        schoolTypeLabel: '本科院校'
      });
    }
    this.setData({ filteredSchoolList: list });
  },

  // 选择学校
  onSelectSchool(e) {
    const name = e.currentTarget.dataset.name;
    this.setData({
      'form.school': name,
      showSchoolPicker: false,
      schoolSearchKey: ''
    });
  },

  onCampusChange(e) {
    this.setData({ 'form.campus': this.data.campusList[e.detail.value] });
  },

  onGradeChange(e) {
    this.setData({ 'form.grade': this.data.gradeList[e.detail.value] });
  },

  onSubmit() {
    const { form } = this.data;
    // 验证必填
    const required = ['nickname', 'school', 'campus', 'grade', 'major', 'studentId', 'contact'];
    const labels = { nickname: '昵称', school: '学校', campus: '校区', grade: '年级', major: '专业', studentId: '学号', contact: '联系方式' };
    for (const key of required) {
      if (!form[key] || !form[key].trim()) {
        wx.showToast({ title: `请填写${labels[key]}`, icon: 'none' });
        return;
      }
    }

    this.setData({ loading: true });

    // 模拟提交认证
    setTimeout(() => {
      this.setData({ loading: false });

      // 更新用户信息
      const user = app.globalData.userInfo;
      Object.assign(user, {
        nickname: form.nickname,
        school: form.school,
        campus: form.campus,
        grade: form.grade,
        major: form.major,
        studentId: form.studentId,
        contact: form.contact,
        verified: true
      });
      app.saveLoginState(user);

      wx.showToast({ title: '认证成功！', icon: 'success' });

      setTimeout(() => {
        wx.switchTab({ url: '/pages/home/home' });
      }, 1000);
    }, 1500);
  },

  onSkip() {
    wx.showModal({
      title: '跳过认证',
      content: '未认证状态下只能浏览商品，无法发布和联系卖家。确定跳过吗？',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({ url: '/pages/home/home' });
        }
      }
    });
  }
});
