// 校园服务汇总页 - 整合常用校园官方服务入口
const { serviceEntries, notificationData, activityData } = require('../../data/campusServices');

Page({
  data: {
    studyServices: [],
    lifeServices: [],
    recentNotices: [],
    recentActivities: []
  },

  onLoad() {
    this.initServices();
    this.loadNotices();
    this.loadActivities();
  },

  onShow() {
    // 每次显示刷新数据
    this.loadNotices();
  },

  onPullDownRefresh() {
    this.initServices();
    this.loadNotices();
    this.loadActivities();
    wx.stopPullDownRefresh();
  },

  // 初始化服务分类
  initServices() {
    // 学习服务
    const studyServices = [
      {
        id: 'library',
        name: '图书馆预约',
        icon: '📚',
        desc: '预约图书馆自习座位',
        page: '/pages/service-library/service-library',
        bgColor: 'linear-gradient(135deg, #E8F0FE, #F0F5FF)'
      },
      {
        id: 'classroom',
        name: '空教室查询',
        icon: '🏫',
        desc: '查找校内空闲教室',
        page: '/pages/service-classroom/service-classroom',
        bgColor: 'linear-gradient(135deg, #E8F5E9, #F1F8E9)'
      },
      {
        id: 'schedule',
        name: '我的课表',
        icon: '📅',
        desc: '查看本周课程安排',
        page: '/pages/service-schedule/service-schedule',
        bgColor: 'linear-gradient(135deg, #FFF3E0, #FFF8E1)',
        badge: '新课'
      },
      {
        id: 'notifications',
        name: '重要通知',
        icon: '📢',
        desc: '学校官方通知公告',
        page: '/pages/service-notice/service-notice',
        bgColor: 'linear-gradient(135deg, #FCE4EC, #F8BBD9)'
      }
    ];

    // 生活服务
    const lifeServices = [
      {
        id: 'activities',
        name: '活动比赛',
        icon: '🏆',
        desc: '校园活动与竞赛报名',
        page: '/pages/service-activity/service-activity',
        bgColor: 'linear-gradient(135deg, #FFF8E1, #FFECB3)'
      },
      {
        id: 'card',
        name: '校园卡服务',
        icon: '💳',
        desc: '余额查询与充值挂失',
        page: '/pages/service-card/service-card',
        bgColor: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
        badge: '新'
      },
      {
        id: 'express',
        name: '快递代取',
        icon: '📦',
        desc: '校内快递代取服务',
        page: '/pages/service-express/service-express',
        bgColor: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)'
      },
      {
        id: 'repair',
        name: '宿舍报修',
        icon: '🔧',
        desc: '在线提交报修申请',
        page: '/pages/service-repair/service-repair',
        bgColor: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)'
      }
    ];

    this.setData({ studyServices, lifeServices });
  },

  // 加载通知数据
  loadNotices() {
    const notices = notificationData.notices.slice(0, 3).map(n => ({
      ...n,
      categoryName: this.getCategoryName(n.category, 'notification'),
      deadlineNear: this.isDeadlineNear(n.deadline || n.time)
    }));
    this.setData({ recentNotices: notices });
  },

  // 加载活动数据
  loadActivities() {
    const activities = activityData.activities.slice(0, 2).map(a => ({
      ...a,
      categoryName: this.getCategoryName(a.category, 'activity'),
      deadlineNear: this.isDeadlineNear(a.deadline)
    }));
    this.setData({ recentActivities: activities });
  },

  // 获取分类名称
  getCategoryName(categoryId, type) {
    if (type === 'notification') {
      const map = {
        'jiaowu': '教务',
        'exam': '考试',
        'library': '图书馆',
        'logistics': '后勤',
        'security': '安全',
        'scholarship': '评优'
      };
      return map[categoryId] || categoryId;
    } else {
      const map = {
        'competition': '学科竞赛',
        'innovation': '创新创业',
        'culture': '文体活动',
        'volunteer': '志愿服务',
        'lecture': '讲座报告'
      };
      return map[categoryId] || categoryId;
    }
  },

  // 判断截止日期是否临近
  isDeadlineNear(dateStr) {
    if (!dateStr) return false;
    const deadline = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  },

  // 服务入口点击
  onServiceTap(e) {
    const item = e.currentTarget.dataset.item;
    if (!item || !item.page) return;
    wx.navigateTo({ url: item.page });
  },

  // 快捷功能点击
  onQuickTap(e) {
    const action = e.currentTarget.dataset.action;
    const pageMap = {
      'scan': '/pages/campus-services/campus-services',
      'card': '/pages/service-card/service-card',
      'schedule': '/pages/service-schedule/service-schedule',
      'more': '/pages/campus-services/campus-services'
    };
    if (pageMap[action]) {
      if (action === 'scan') {
        wx.showToast({ title: '扫码功能开发中', icon: 'none' });
      } else {
        wx.navigateTo({ url: pageMap[action] });
      }
    }
  },

  // 通知点击
  onNoticeTap(e) {
    const notice = e.currentTarget.dataset.notice;
    wx.showModal({
      title: notice.title,
      content: notice.content || notice.summary,
      confirmText: '我知道了',
      showCancel: false
    });
  },

  // 更多通知
  onMoreNotice() {
    wx.navigateTo({ url: '/pages/service-notice/service-notice' });
  },

  // 活动点击
  onActivityTap(e) {
    const activity = e.currentTarget.dataset.activity;
    wx.showModal({
      title: activity.name,
      content: `${activity.desc}\n\n📍 地点：${activity.place}\n👥 参与人数：${activity.participants}\n📅 截止报名：${activity.deadline}\n🏢 主办方：${activity.organizer}`,
      confirmText: '立即报名',
      cancelText: '稍后再说',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '报名成功！', icon: 'success' });
        }
      }
    });
  },

  // 更多活动
  onMoreActivity() {
    wx.navigateTo({ url: '/pages/service-activity/service-activity' });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '校园服务汇总',
      path: '/pages/campus-services/campus-services'
    };
  }
});
