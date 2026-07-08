const app = getApp();
const beijingColleges = require('../../data/beijingColleges.js');

Page({
  data: {
    // ===== 账号资料 =====
    avatarPreview: '',
    tempAvatarPath: '',
    nickname: '',
    contact: '',

    // ===== 校园信息 =====
    school: '',
    campus: '',
    campusIndex: 0,
    campusList: ['主校区', '东校区', '西校区', '南校区', '北校区'],
    grade: '',
    gradeIndex: 0,
    gradeList: ['2025级', '2024级', '2023级', '2022级', '2021级', '2020级', '研究生'],
    major: '',

    // ===== 学校搜索弹窗 =====
    showSchoolPicker: false,
    schoolSearchKey: '',
    filteredSchoolList: [],

    // ===== 隐私开关 =====
    showContact: true,
    showMyPosts: true,
    receiveNotify: true,
    receiveTradeNotify: true,
    allowRiskCheck: true,

    // ===== 修改密码弹窗 =====
    showPwdModal: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',

    // ===== 原始数据快照（用于判断是否有修改） =====
    _original: null
  },

  onShow() {
    this.loadAllData();
  },

  // ==================== 数据加载 ====================

  loadAllData() {
    const userInfo = app.globalData.userInfo;
    if (!userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    const privacy = wx.getStorageSync('privacySettings') || {};

    // 校区index
    let campusIndex = this.data.campusList.indexOf(userInfo.campus || '');
    if (campusIndex < 0) campusIndex = 0;

    // 年级index
    let gradeIndex = this.data.gradeList.indexOf(userInfo.grade || '');
    if (gradeIndex < 0) gradeIndex = 0;

    const snapshot = {
      avatarPreview: userInfo.avatar || '',
      nickname: userInfo.nickname || '',
      contact: userInfo.contact || userInfo.phone || '',
      school: userInfo.school || '',
      campus: userInfo.campus || '',
      campusIndex: campusIndex,
      grade: userInfo.grade || '',
      gradeIndex: gradeIndex,
      major: userInfo.major || '',
      showContact: privacy.showContact !== false,
      showMyPosts: privacy.showMyPosts !== false,
      receiveNotify: privacy.receiveNotify !== false,
      receiveTradeNotify: privacy.receiveTradeNotify !== false,
      allowRiskCheck: privacy.allowRiskCheck !== false
    };

    this.setData({
      avatarPreview: snapshot.avatarPreview,
      tempAvatarPath: '',
      nickname: snapshot.nickname,
      contact: snapshot.contact,
      school: snapshot.school,
      campus: snapshot.campus,
      campusIndex: snapshot.campusIndex,
      grade: snapshot.grade,
      gradeIndex: snapshot.gradeIndex,
      major: snapshot.major,
      showContact: snapshot.showContact,
      showMyPosts: snapshot.showMyPosts,
      receiveNotify: snapshot.receiveNotify,
      receiveTradeNotify: snapshot.receiveTradeNotify,
      allowRiskCheck: snapshot.allowRiskCheck,
      _original: snapshot
    });
  },

  // ==================== 头像修改 ====================

  onChangeAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          avatarPreview: tempFilePath,
          tempAvatarPath: tempFilePath
        });
      }
      // 取消选择不做任何处理，保持原头像
    });
  },

  // ==================== 文本输入 ====================

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  onContactInput(e) {
    this.setData({ contact: e.detail.value });
  },

  onMajorInput(e) {
    this.setData({ major: e.detail.value });
  },

  // ==================== 校园信息 ====================

  // 学校搜索弹窗
  onOpenSchoolPicker() {
    this.filterSchools(this.data.schoolSearchKey || '');
    this.setData({ showSchoolPicker: true });
  },

  onCloseSchoolPicker() {
    this.setData({ showSchoolPicker: false, schoolSearchKey: '' });
  },

  onSchoolSearch(e) {
    const keyword = e.detail.value;
    this.filterSchools(keyword);
    this.setData({ schoolSearchKey: keyword });
  },

  onClearSchoolSearch() {
    this.filterSchools('');
    this.setData({ schoolSearchKey: '' });
  },

  filterSchools(keyword) {
    let list = [];
    if (keyword && keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = beijingColleges.filter(item => item.name.toLowerCase().includes(kw));
    } else {
      list = beijingColleges;
    }
    this.setData({ filteredSchoolList: list });
  },

  onSelectSchool(e) {
    const name = e.currentTarget.dataset.name;
    this.setData({
      school: name,
      showSchoolPicker: false,
      schoolSearchKey: ''
    });
  },

  // 校区picker
  onCampusChange(e) {
    const idx = parseInt(e.detail.value);
    this.setData({
      campusIndex: idx,
      campus: this.data.campusList[idx]
    });
  },

  // 年级picker
  onGradeChange(e) {
    const idx = parseInt(e.detail.value);
    this.setData({
      gradeIndex: idx,
      grade: this.data.gradeList[idx]
    });
  },

  // ==================== 隐私开关 ====================

  onShowContactChange(e) {
    this.setData({ showContact: e.detail.value });
  },

  onShowMyPostsChange(e) {
    this.setData({ showMyPosts: e.detail.value });
  },

  onReceiveNotifyChange(e) {
    this.setData({ receiveNotify: e.detail.value });
  },

  onReceiveTradeNotifyChange(e) {
    this.setData({ receiveTradeNotify: e.detail.value });
  },

  onAllowRiskCheckChange(e) {
    this.setData({ allowRiskCheck: e.detail.value });
  },

  // ==================== 修改密码弹窗 ====================

  onChangePassword() {
    this.setData({
      showPwdModal: true,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  },

  onClosePwdModal() {
    this.setData({ showPwdModal: false });
  },

  onOldPwdInput(e) {
    this.setData({ oldPassword: e.detail.value });
  },

  onNewPwdInput(e) {
    this.setData({ newPassword: e.detail.value });
  },

  onConfirmPwdInput(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  onSubmitPassword() {
    const { oldPassword, newPassword, confirmPassword } = this.data;

    // 校验原密码不能为空
    if (!oldPassword || oldPassword.trim().length === 0) {
      wx.showToast({ title: '原密码不能为空', icon: 'none' });
      return;
    }

    // 校验新密码不能为空
    if (!newPassword || newPassword.trim().length === 0) {
      wx.showToast({ title: '新密码不能为空', icon: 'none' });
      return;
    }

    // 校验确认新密码不能为空
    if (!confirmPassword || confirmPassword.trim().length === 0) {
      wx.showToast({ title: '确认新密码不能为空', icon: 'none' });
      return;
    }

    // 新密码长度不少于6位
    if (newPassword.length < 6) {
      wx.showToast({ title: '新密码长度不少于6位', icon: 'none' });
      return;
    }

    // 新密码与确认新密码必须一致
    if (newPassword !== confirmPassword) {
      wx.showToast({ title: '两次输入的新密码不一致', icon: 'none' });
      return;
    }

    // 新密码不能与原密码完全相同
    if (newPassword === oldPassword) {
      wx.showToast({ title: '新密码不能与原密码相同', icon: 'none' });
      return;
    }

    // 校验原密码是否正确
    const savedPwd = wx.getStorageSync('userPassword');
    const loginPwd = wx.getStorageSync('savedAccount');
    let correctPwd = '';
    if (savedPwd) {
      correctPwd = savedPwd;
    } else if (loginPwd && loginPwd.password) {
      correctPwd = loginPwd.password;
    } else {
      // 首次设置密码，默认密码为 "123456"
      correctPwd = '123456';
    }

    if (oldPassword !== correctPwd) {
      wx.showToast({ title: '原密码不正确', icon: 'none' });
      return;
    }

    // 保存新密码
    wx.setStorageSync('userPassword', newPassword);
    this.setData({ showPwdModal: false });
    wx.showToast({ title: '密码修改成功', icon: 'success' });
  },

  // ==================== 保存 ====================

  onSave() {
    const {
      nickname, contact, tempAvatarPath,
      school, campus, grade, major,
      showContact, showMyPosts, receiveNotify, receiveTradeNotify, allowRiskCheck,
      _original
    } = this.data;

    // 昵称校验
    if (!nickname || nickname.trim().length === 0) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }
    const trimmedNick = nickname.trim();
    if (trimmedNick.length < 2) {
      wx.showToast({ title: '昵称至少2个字符', icon: 'none' });
      return;
    }
    if (trimmedNick.length > 12) {
      wx.showToast({ title: '昵称最多12个字符', icon: 'none' });
      return;
    }

    // 联系方式校验
    if (!contact || contact.trim().length === 0) {
      wx.showToast({ title: '联系方式不能为空', icon: 'none' });
      return;
    }

    // 判断是否有修改
    const hasChanges = this._hasChanges();
    if (!hasChanges) {
      wx.showToast({ title: '暂无修改', icon: 'none' });
      return;
    }

    // 更新用户信息
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      userInfo.nickname = trimmedNick;
      userInfo.contact = contact.trim();
      userInfo.school = school;
      userInfo.campus = campus;
      userInfo.grade = grade;
      userInfo.major = major;
      if (tempAvatarPath) {
        userInfo.avatar = tempAvatarPath;
      }

      // 同时更新 goodsList 中该用户作为卖家的信息
      app.globalData.goodsList.forEach(g => {
        if (g.seller.id === userInfo.id) {
          g.seller.name = trimmedNick;
          if (tempAvatarPath) {
            g.seller.avatar = tempAvatarPath;
          }
          g.seller.school = school;
          g.seller.grade = grade;
          // 更新联系方式到商品上
          g.contact = contact.trim();
        }
      });

      // 保存到全局和本地缓存
      app.globalData.userInfo = userInfo;
      wx.setStorageSync('userInfo', userInfo);
    }

    // 保存隐私设置
    wx.setStorageSync('privacySettings', {
      showContact: showContact,
      showMyPosts: showMyPosts,
      receiveNotify: receiveNotify,
      receiveTradeNotify: receiveTradeNotify,
      allowRiskCheck: allowRiskCheck
    });

    // 更新本地快照
    const newSnapshot = {
      avatarPreview: tempAvatarPath || _original.avatarPreview,
      nickname: trimmedNick,
      contact: contact.trim(),
      school: school,
      campus: campus,
      campusIndex: this.data.campusIndex,
      grade: grade,
      gradeIndex: this.data.gradeIndex,
      major: major,
      showContact: showContact,
      showMyPosts: showMyPosts,
      receiveNotify: receiveNotify,
      receiveTradeNotify: receiveTradeNotify,
      allowRiskCheck: allowRiskCheck
    };

    this.setData({
      nickname: trimmedNick,
      contact: contact.trim(),
      avatarPreview: tempAvatarPath || this.data.avatarPreview,
      tempAvatarPath: '',
      _original: newSnapshot
    });

    wx.showToast({ title: '资料已更新', icon: 'success' });
  },

  // 判断是否有修改
  _hasChanges() {
    const d = this.data;
    const o = d._original;
    if (!o) return true;
    return (
      d.nickname !== o.nickname ||
      d.contact !== o.contact ||
      d.tempAvatarPath !== '' ||
      d.school !== o.school ||
      d.campus !== o.campus ||
      d.grade !== o.grade ||
      d.major !== o.major ||
      d.showContact !== o.showContact ||
      d.showMyPosts !== o.showMyPosts ||
      d.receiveNotify !== o.receiveNotify ||
      d.receiveTradeNotify !== o.receiveTradeNotify ||
      d.allowRiskCheck !== o.allowRiskCheck
    );
  }
});
