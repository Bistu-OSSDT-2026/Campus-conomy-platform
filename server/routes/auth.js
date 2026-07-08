/**
 * 路由 - 认证（注册 / 登录 / 校园认证）
 */
const express = require('express');
const router = express.Router();
const { readJSON, writeJSON, findById } = require('../utils/fileStore');
const { generateId, getNow } = require('../utils/id');

// ========== POST /api/auth/register ==========
// 注册新用户
router.post('/register', (req, res) => {
  const { phone, email, password, nickname } = req.body;

  // 校验：手机号或邮箱至少填一个
  if (!phone && !email) {
    return res.json({ code: 400, msg: '手机号或邮箱至少填写一个' });
  }
  // 校验：密码不能为空
  if (!password || password.trim() === '') {
    return res.json({ code: 400, msg: '密码不能为空' });
  }
  // 校验：昵称不能为空
  if (!nickname || nickname.trim() === '') {
    return res.json({ code: 400, msg: '昵称不能为空' });
  }

  const users = readJSON('users.json');

  // 检查手机号是否已注册
  if (phone && users.find(u => u.phone === phone)) {
    return res.json({ code: 400, msg: '该手机号已被注册' });
  }
  // 检查邮箱是否已注册
  if (email && users.find(u => u.email === email)) {
    return res.json({ code: 400, msg: '该邮箱已被注册' });
  }

  // 创建新用户
  const newUser = {
    id: generateId('u'),
    nickname: nickname.trim(),
    avatar: '/images/default-avatar.png',
    phone: phone || '',
    email: email || '',
    password: password,          // 注：生产环境应该加密存储
    school: '',
    campus: '',
    grade: '',
    major: '',
    studentNo: '',
    contact: phone || email || '',
    certified: false,
    isAdmin: false,
    privacySettings: {
      showContact: true,
      allowViewPosts: true,
      systemNotice: true,
      tradeNotice: true,
      allowVerify: true
    },
    createdAt: getNow()
  };

  users.push(newUser);
  writeJSON('users.json', users);

  // 返回用户信息（不包含密码）
  const { password: pwd, ...userInfo } = newUser;
  res.json({ code: 200, msg: '注册成功', data: userInfo });
});

// ========== POST /api/auth/login ==========
// 登录（account 可以是手机号或邮箱）
router.post('/login', (req, res) => {
  const { account, password } = req.body;

  if (!account || !password) {
    return res.json({ code: 400, msg: '账号和密码不能为空' });
  }

  const users = readJSON('users.json');

  // 查找用户：account 匹配手机号或邮箱
  const user = users.find(u =>
    u.phone === account || u.email === account
  );

  if (!user) {
    return res.json({ code: 400, msg: '账号不存在' });
  }
  if (user.password !== password) {
    return res.json({ code: 400, msg: '密码错误' });
  }

  // 返回用户信息（不包含密码），用 userId 标识登录状态
  const { password: pwd, ...userInfo } = user;
  res.json({ code: 200, msg: '登录成功', data: userInfo });
});

// ========== POST /api/auth/certification ==========
// 校园身份认证
router.post('/certification', (req, res) => {
  const { userId, school, campus, grade, major, studentNo, contact } = req.body;

  // 校验必填字段
  if (!userId) return res.json({ code: 400, msg: 'userId 不能为空' });
  if (!school) return res.json({ code: 400, msg: '学校不能为空' });
  if (!campus) return res.json({ code: 400, msg: '校区不能为空' });
  if (!grade) return res.json({ code: 400, msg: '年级不能为空' });
  if (!major) return res.json({ code: 400, msg: '专业不能为空' });
  if (!contact) return res.json({ code: 400, msg: '联系方式不能为空' });

  const users = readJSON('users.json');
  const user = findById(users, userId);

  if (!user) {
    return res.json({ code: 400, msg: '用户不存在' });
  }

  // 保存认证信息
  user.school = school;
  user.campus = campus;
  user.grade = grade;
  user.major = major;
  user.studentNo = studentNo || '';
  user.contact = contact;
  user.certified = true;

  writeJSON('users.json', users);

  const { password: pwd, ...userInfo } = user;
  res.json({ code: 200, msg: '认证成功', data: userInfo });
});

module.exports = router;
