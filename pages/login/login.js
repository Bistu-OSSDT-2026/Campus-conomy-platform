const app = getApp();

Page({
  data: {
    // 页面模式：login / register
    mode: 'login',
    loginType: 'phone',
    phone: '',
    email: '',
    password: '',
    showPassword: false,
    rememberPwd: false,
    loading: false,
    // 注册专用字段
    nickname: '',
    confirmPassword: '',
    showConfirmPassword: false
  },

  onLoad() {
    // 如果已登录，直接跳转首页
    if (app.globalData.isLoggedIn) {
      wx.switchTab({ url: '/pages/home/home' });
      return;
    }
    // 读取记住的账号
    const saved = wx.getStorageSync('savedAccount');
    if (saved) {
      this.setData({
        loginType: saved.type || 'phone',
        phone: saved.phone || '',
        email: saved.email || '',
        password: saved.password || '',
        rememberPwd: true
      });
    }
  },

  // ========== 模式切换 ==========
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      mode: mode,
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false
    });
  },

  switchTab(e) {
    this.setData({ loginType: e.currentTarget.dataset.type });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onEmailInput(e) {
    this.setData({ email: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  // 注册专用：昵称输入
  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  // 注册专用：确认密码输入
  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword });
  },

  // 注册专用：切换确认密码可见
  toggleConfirmPassword() {
    this.setData({ showConfirmPassword: !this.data.showConfirmPassword });
  },

  toggleRemember() {
    this.setData({ rememberPwd: !this.data.rememberPwd });
  },

  onLogin() {
    const { loginType, phone, email, password } = this.data;

    // 验证
    if (loginType === 'phone') {
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
        return;
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        wx.showToast({ title: '请输入正确的邮箱', icon: 'none' });
        return;
      }
    }
    if (!password || password.length < 6) {
      wx.showToast({ title: '密码至少6位', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    // 尝试后端登录
    const account = loginType === 'phone' ? phone : email;
    wx.request({
      url: 'http://127.0.0.1:3000/api/auth/login',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        account: loginType === 'phone' ? phone : email,
        password: password
      },
      timeout: 5000,
      success: (res) => {
        this.setData({ loading: false });
        if (res.data && res.data.code === 200 && res.data.data) {
          const serverUser = res.data.data;
          const userInfo = {
            id: serverUser.id,
            nickname: serverUser.nickname,
            account: account,
            phone: serverUser.phone || '',
            email: serverUser.email || '',
            avatar: serverUser.avatar || '/images/avatar1.png',
            role: serverUser.isAdmin ? 'admin' : 'user',
            verified: serverUser.certified || false,
            school: serverUser.school || '',
            campus: serverUser.campus || '',
            grade: serverUser.grade || '',
            major: serverUser.major || '',
            studentId: serverUser.studentNo || '',
            contact: serverUser.contact || ''
          };
          this.doLoginSuccess(userInfo);
        } else {
          wx.showToast({ title: (res.data && res.data.msg) || '账号或密码错误', icon: 'none' });
        }
      },
      fail: () => {
        // 后端不可用，降级到本地模拟登录
        console.log('后端服务不可用，使用本地模拟登录');
        this.setData({ loading: false });
        const isAdminAccount = account === 'admin@campus.com' || account === '13800000000';
        const userInfo = {
          id: isAdminAccount ? 'u003' : 'u001',
          nickname: isAdminAccount ? '校园管理员' : '吕泽卿',
          account: account,
          phone: loginType === 'phone' ? phone : '',
          email: loginType === 'email' ? email : '',
          avatar: '/images/avatar/lvzeqing.jpg',
          role: isAdminAccount ? 'admin' : 'user',
          verified: true,
          school: '北京信息科技大学',
          campus: '沙河校区',
          grade: '2025级',
          major: '计算机科学与技术',
          studentId: '20230101001',
          contact: loginType === 'phone' ? phone : email
        };
        this.doLoginSuccess(userInfo);
      }
    });
  },

  doLoginSuccess(userInfo) {
    // 保存登录状态
    app.saveLoginState(userInfo);

    // 记住密码
    if (this.data.rememberPwd) {
      wx.setStorageSync('savedAccount', {
        type: this.data.loginType,
        phone: this.data.phone,
        email: this.data.email,
        password: this.data.password
      });
    } else {
      wx.removeStorageSync('savedAccount');
    }

    wx.showToast({ title: '登录成功', icon: 'success' });

    setTimeout(() => {
      // 已认证直接进首页，未认证去认证页
      if (userInfo.verified) {
        wx.switchTab({ url: '/pages/home/home' });
      } else {
        wx.redirectTo({ url: '/pages/verify/verify' });
      }
    }, 800);
  },

  onForgotPwd() {
    wx.showModal({
      title: '提示',
      content: '请联系管理员重置密码\n管理员邮箱: admin@campus.com',
      showCancel: false
    });
  },

  // ========== 注册 ==========

  /**
   * 注册校验
   * 返回 { valid: boolean, msg: string }
   */
  validateRegister() {
    const { loginType, phone, email, nickname, password, confirmPassword } = this.data;

    // 1. 昵称不能为空
    if (!nickname || !nickname.trim()) {
      return { valid: false, msg: '请输入昵称' };
    }
    // 2. 昵称长度 2-12 个字符
    const trimmedNick = nickname.trim();
    if (trimmedNick.length < 2 || trimmedNick.length > 12) {
      return { valid: false, msg: '昵称长度为 2-12 个字符' };
    }
    // 3. 手机号或邮箱至少填一个
    if (loginType === 'phone') {
      if (!phone) return { valid: false, msg: '请输入手机号' };
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        return { valid: false, msg: '手机号格式不正确' };
      }
    } else {
      if (!email) return { valid: false, msg: '请输入邮箱' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, msg: '邮箱格式不正确' };
      }
    }
    // 4. 密码不能为空
    if (!password) {
      return { valid: false, msg: '请输入密码' };
    }
    // 5. 密码长度不少于 6 位
    if (password.length < 6) {
      return { valid: false, msg: '密码长度不能少于 6 位' };
    }
    // 6. 确认密码不能为空
    if (!confirmPassword) {
      return { valid: false, msg: '请再次确认密码' };
    }
    // 7. 两次密码必须一致
    if (password !== confirmPassword) {
      return { valid: false, msg: '两次输入的密码不一致' };
    }

    // 8. 检查是否重复注册（本地缓存 + 后端模拟数据）
    const users = wx.getStorageSync('users') || [];
    if (loginType === 'phone' && users.find(u => u.phone === phone)) {
      return { valid: false, msg: '该手机号已注册' };
    }
    if (loginType === 'email' && users.find(u => u.email === email)) {
      return { valid: false, msg: '该邮箱已注册' };
    }

    return { valid: true, msg: '' };
  },

  /**
   * 注册提交
   * 优先尝试后端接口，失败则使用本地缓存
   */
  onRegister() {
    const result = this.validateRegister();
    if (!result.valid) {
      wx.showToast({ title: result.msg, icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    // 优先尝试后端接口
    this.registerViaServer();
  },

  /**
   * 通过后端接口注册
   */
  registerViaServer() {
    const { loginType, phone, email, nickname, password } = this.data;
    const requestData = {
      nickname: nickname.trim(),
      password: password
    };
    if (loginType === 'phone') {
      requestData.phone = phone;
    } else {
      requestData.email = email;
    }

    wx.request({
      url: 'http://127.0.0.1:3000/api/auth/register',
      method: 'POST',
      data: requestData,
      timeout: 5000,
      success: (res) => {
        this.setData({ loading: false });
        if (res.data && res.data.code === 200) {
          this.onRegisterSuccess(res.data.data);
        } else {
          // 后端返回错误（如重复注册）
          const msg = res.data && res.data.msg ? res.data.msg : '注册失败';
          wx.showToast({ title: msg, icon: 'none' });
        }
      },
      fail: () => {
        // 后端不可用，降级到本地缓存注册
        console.log('后端服务不可用，使用本地缓存注册');
        this.registerLocally();
      }
    });
  },

  /**
   * 本地缓存注册（后端不可用时的降级方案）
   */
  registerLocally() {
    const { loginType, phone, email, nickname, password } = this.data;

    // 再次确认无重复（可能在前次请求期间数据变化）
    const users = wx.getStorageSync('users') || [];
    if (loginType === 'phone' && users.find(u => u.phone === phone)) {
      this.setData({ loading: false });
      wx.showToast({ title: '该手机号已注册', icon: 'none' });
      return;
    }
    if (loginType === 'email' && users.find(u => u.email === email)) {
      this.setData({ loading: false });
      wx.showToast({ title: '该邮箱已注册', icon: 'none' });
      return;
    }

    // 生成用户数据
    const newUser = this.buildNewUser(nickname, phone, email, password);
    users.push(newUser);
    wx.setStorageSync('users', users);

    this.setData({ loading: false });
    this.onRegisterSuccess(newUser);
  },

  /**
   * 构建新用户数据结构
   * 注：当前为课程演示版，密码仅用于模拟登录。
   * 真实上线时应使用加密（如 bcrypt）存储密码。
   */
  buildNewUser(nickname, phone, email, password) {
    const now = new Date();
    const timeStr = app.formatTime(now);
    return {
      id: 'U' + now.getTime(),
      nickname: nickname.trim(),
      avatar: '/images/default-avatar.png',
      phone: phone || '',
      email: email || '',
      password: password,       // 演示版明文存储，生产环境需加密
      school: '',
      campus: '',
      grade: '',
      major: '',
      studentNo: '',
      contact: phone || email || '',
      certified: false,          // 注册后默认未认证
      verified: false,
      role: 'user',
      isAdmin: false,
      privacySettings: {
        showContact: true,
        allowViewPosts: true,
        systemNotice: true,
        tradeNotice: true,
        allowVerify: true
      },
      createdAt: timeStr
    };
  },

  /**
   * 注册成功后的处理
   */
  onRegisterSuccess(userInfo) {
    // 保存登录状态
    app.saveLoginState(userInfo);

    wx.showToast({ title: '注册成功，请完成校园身份认证', icon: 'none', duration: 2000 });

    // 1.5秒后跳转到校园认证页，并传递注册信息方便回填
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/verify/verify?fromRegister=1&contact=' +
          encodeURIComponent(userInfo.contact || userInfo.phone || '')
      });
    }, 2000);
  },

  // ========== 跳转注册（已废弃，改为页面内切换模式） ==========
  onGoRegister() {
    // 切换到注册模式
    this.setData({
      mode: 'register',
      password: '',
      showPassword: false
    });
  }
});
