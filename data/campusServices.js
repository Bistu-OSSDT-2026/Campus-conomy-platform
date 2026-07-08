// ============================================================
// 校园官方服务模拟数据
// 说明：当前为课程展示模拟数据，正式上线需接入学校官方接口
// ============================================================

// ---------- 图书馆座位预约 ----------
const libraryData = {
  campuses: [
    { id: 'shahe', name: '沙河校区图书馆' },
    { id: 'xiaoying', name: '小营校区图书馆' }
  ],
  floors: [
    { id: 'f1', name: '一层自习区', seats: 20 },
    { id: 'f2', name: '二层阅览区', seats: 20 },
    { id: 'f3', name: '三层考研区', seats: 20 },
    { id: 'f4', name: '四层安静区', seats: 20 }
  ],
  timeSlots: [
    { id: 't1', label: '08:00-10:00', value: '08:00-10:00' },
    { id: 't2', label: '10:00-12:00', value: '10:00-12:00' },
    { id: 't3', label: '14:00-16:00', value: '14:00-16:00' },
    { id: 't4', label: '16:00-18:00', value: '16:00-18:00' },
    { id: 't5', label: '19:00-21:00', value: '19:00-21:00' }
  ],
  // 座位状态：available / booked / maintenance
  generateSeats: function(floorId) {
    const prefix = { f1: 'A', f2: 'B', f3: 'C', f4: 'D' }[floorId] || 'A';
    const seats = [];
    for (let i = 1; i <= 20; i++) {
      const num = String(i).padStart(2, '0');
      // 模拟：部分座位已预约或维修中
      let status = 'available';
      if (i === 5 || i === 12 || i === 18) status = 'booked';
      if (i === 8 || i === 15) status = 'maintenance';
      seats.push({
        id: `${prefix}${num}`,
        label: `${prefix}${num}`,
        status: status
      });
    }
    return seats;
  }
};

// ---------- 空教室查询 ----------
const classroomData = {
  campuses: [
    { id: 'shahe', name: '沙河校区' },
    { id: 'xiaoying', name: '小营校区' }
  ],
  buildings: [
    { id: 'bldA', name: '教学楼A' },
    { id: 'bldB', name: '教学楼B' },
    { id: 'bldC', name: '实验楼' },
    { id: 'bldD', name: '信息楼' }
  ],
  periods: [
    { id: 'p1', label: '第1-2节 (08:00-09:35)' },
    { id: 'p2', label: '第3-4节 (10:00-11:35)' },
    { id: 'p3', label: '第5-6节 (14:00-15:35)' },
    { id: 'p4', label: '第7-8节 (16:00-17:35)' },
    { id: 'p5', label: '晚自习 (19:00-21:00)' }
  ],
  // 模拟空教室数据
  getRoomsByBuilding: function(buildingId, periodId) {
    const rooms = {
      bldA: [
        { id: 'A101', name: 'A101', capacity: 60, type: '多媒体教室', equipment: '投影仪、空调、WiFi' },
        { id: 'A203', name: 'A203', capacity: 45, type: '普通教室', equipment: '黑板、空调、WiFi' },
        { id: 'A305', name: 'A305', capacity: 80, type: '阶梯教室', equipment: '投影仪、音响、空调' },
        { id: 'A408', name: 'A408', capacity: 35, type: '小教室', equipment: '白板、空调' }
      ],
      bldB: [
        { id: 'B102', name: 'B102', capacity: 70, type: '多媒体教室', equipment: '投影仪、空调、WiFi' },
        { id: 'B205', name: 'B205', capacity: 50, type: '普通教室', equipment: '黑板、空调、WiFi' },
        { id: 'B309', name: 'B309', capacity: 90, type: '阶梯教室', equipment: '投影仪、音响、空调' }
      ],
      bldC: [
        { id: 'C201', name: 'C201', capacity: 40, type: '实验室', equipment: '实验台、投影仪' },
        { id: 'C303', name: 'C303', capacity: 30, type: '机房', equipment: '电脑、投影仪、空调' }
      ],
      bldD: [
        { id: 'D101', name: 'D101', capacity: 100, type: '报告厅', equipment: '投影仪、音响、空调' },
        { id: 'D203', name: 'D203', capacity: 55, type: '多媒体教室', equipment: '投影仪、空调、WiFi' },
        { id: 'D306', name: 'D306', capacity: 40, type: '机房', equipment: '电脑、投影仪、空调' }
      ]
    };
    // 不同节次返回不同模拟数据（让结果有变化）
    const idx = parseInt(periodId.replace('p', '')) || 1;
    const available = (rooms[buildingId] || rooms.bldA);
    // 模拟：不同时段可用的教室略有不同
    const start = (idx - 1) % available.length;
    return available.slice(start).concat(available.slice(0, start));
  }
};

// ---------- 我的课表 ----------
const scheduleData = {
  courses: [
    { id: 'c1', name: '高等数学', teacher: '张明华', room: 'A203', time: '08:00-09:35', weekday: 1, weeks: '1-16周', color: '#4A6CF7' },
    { id: 'c2', name: '大学英语', teacher: '李芳', room: 'B102', time: '10:00-11:35', weekday: 1, weeks: '1-16周', color: '#F5A623' },
    { id: 'c3', name: '数据结构', teacher: '王建国', room: 'A305', time: '08:00-09:35', weekday: 2, weeks: '1-16周', color: '#6ECB70' },
    { id: 'c4', name: 'Java程序设计', teacher: '刘伟', room: 'C303', time: '14:00-15:35', weekday: 2, weeks: '3-18周', color: '#FF6B6B' },
    { id: 'c5', name: '操作系统', teacher: '陈志强', room: 'D203', time: '10:00-11:35', weekday: 3, weeks: '1-16周', color: '#9B59B6' },
    { id: 'c6', name: '体育', teacher: '赵勇', room: '体育馆', time: '14:00-15:35', weekday: 3, weeks: '1-16周', color: '#1ABC9C' },
    { id: 'c7', name: '思想道德与法治', teacher: '周文', room: 'B309', time: '16:00-17:35', weekday: 4, weeks: '1-12周', color: '#E67E22' },
    { id: 'c8', name: '高等数学', teacher: '张明华', room: 'A203', time: '08:00-09:35', weekday: 4, weeks: '1-16周', color: '#4A6CF7' },
    { id: 'c9', name: '大学英语', teacher: '李芳', room: 'B102', time: '10:00-11:35', weekday: 5, weeks: '1-16周', color: '#F5A623' },
    { id: 'c10', name: '数据结构', teacher: '王建国', room: 'A305', time: '08:00-09:35', weekday: 5, weeks: '1-16周', color: '#6ECB70' }
  ],
  weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  maxWeek: 20
};

// ---------- 重要通知 ----------
const notificationData = {
  categories: [
    { id: 'all', name: '全部' },
    { id: 'jiaowu', name: '教务通知' },
    { id: 'exam', name: '考试安排' },
    { id: 'library', name: '图书馆通知' },
    { id: 'logistics', name: '后勤通知' },
    { id: 'security', name: '安全提醒' },
    { id: 'scholarship', name: '评优评奖' }
  ],
  notices: [
    {
      id: 'n1',
      title: '关于2025级学生选课安排的通知',
      category: 'jiaowu',
      time: '2026-06-28',
      summary: '2025级本科生下学期选课将于7月5日正式开始，请同学们提前查看培养方案，合理规划课程。',
      content: '各学院、2025级本科生：根据学校教学工作安排，2025级本科生2026-2027学年第一学期选课工作将于7月5日（周一）9:00正式开始。请同学们提前登录教务系统查看本专业培养方案，了解课程设置和学分要求。选课分为预选、正选和补退选三个阶段，具体时间安排如下：预选阶段：7月5日9:00 - 7月8日17:00；正选阶段：7月12日9:00 - 7月15日17:00；补退选阶段：开学第一周。请务必在规定时间内完成选课，逾期不予补选。如有疑问，请联系所在学院教务办公室。',
      important: true
    },
    {
      id: 'n2',
      title: '图书馆暑期开放时间调整通知',
      category: 'library',
      time: '2026-06-26',
      summary: '暑假期间图书馆开放时间调整为周一至周五 8:00-17:00，周末闭馆。',
      content: '各位读者：根据学校暑期工作安排，图书馆将于7月10日至8月25日调整开放时间。具体安排如下：开放时间：周一至周五 8:00-17:00；周六、周日闭馆。电子资源24小时正常访问。暑期到期的图书自动顺延至开学后两周内归还。请各位读者相互转告，合理安排来馆时间。',
      important: false
    },
    {
      id: 'n3',
      title: '关于期末考试诚信考试的提醒',
      category: 'exam',
      time: '2026-06-25',
      summary: '2025-2026学年第二学期期末考试即将开始，请同学们严格遵守考试纪律，诚信应考。',
      content: '全体同学：2025-2026学年第二学期期末考试将于7月3日至7月16日进行。学校再次提醒全体考生：严格遵守考试纪律，严禁携带手机、智能手表等电子设备进入考场；严禁替考、抄袭、夹带等作弊行为。违反考试纪律者，将按照《学生违纪处分条例》严肃处理。请同学们认真复习，诚信应考。',
      important: true
    },
    {
      id: 'n4',
      title: '校园网络维护通知',
      category: 'logistics',
      time: '2026-06-24',
      summary: '为提升校园网络质量，将于7月2日（周六）凌晨进行网络设备升级维护。',
      content: '各位师生：为进一步提升校园网络服务质量，信息化建设与管理中心计划于7月2日（周六）00:00-06:00对沙河校区核心网络设备进行升级维护。届时校园网及无线网络将出现短暂中断，请提前做好相关准备。升级完成后网络质量将有明显提升。如有问题请拨打技术支持电话：010-82427196。',
      important: false
    },
    {
      id: 'n5',
      title: '大学生创新创业比赛报名通知',
      category: 'jiaowu',
      time: '2026-06-22',
      summary: '2026年度大学生创新创业训练计划项目申报工作现已启动，欢迎同学们积极申报。',
      content: '各学院：2026年度大学生创新创业训练计划项目申报工作现已启动。本项目旨在培养大学生的创新思维和创业能力，鼓励跨学科、跨专业组队。项目类型包括创新训练项目、创业训练项目和创业实践项目三类。申报截止时间：2026年7月20日。申报方式：登录教务系统-创新创业模块在线填报。学校将对立项项目给予经费支持和学分认定。',
      important: true
    },
    {
      id: 'n6',
      title: '关于开展2025-2026学年学生综合测评工作的通知',
      category: 'scholarship',
      time: '2026-06-20',
      summary: '即日起开展学生综合素质测评，测评结果将作为奖学金评定和评优的重要依据。',
      content: '各学院、各班级：根据学校工作安排，即日起开展2025-2026学年学生综合素质测评工作。测评内容包括思想政治、学业成绩、科研创新、社会实践、文体活动等方面。请同学们认真填写自评部分，并在规定时间内提交佐证材料。测评时间为6月20日至7月5日，逾期不予受理。测评结果将作为本学年奖学金评定和各项评优的重要依据。',
      important: false
    },
    {
      id: 'n7',
      title: '关于暑期学生宿舍安全检查的通知',
      category: 'security',
      time: '2026-06-18',
      summary: '为保障暑期宿舍安全，学校将开展宿舍安全专项检查工作。',
      content: '各位同学：暑期将至，为切实保障学生宿舍安全，学校将于7月8日至7月10日对全体学生宿舍进行安全专项检查。检查内容包括：用电安全、消防设施、门窗安全等。请同学们提前自查，严禁使用违规电器，离校前关闭电源、关好门窗。留校同学请严格遵守宿舍管理规定。',
      important: false
    }
  ]
};

// ---------- 活动比赛 ----------
const activityData = {
  categories: [
    { id: 'all', name: '全部' },
    { id: 'competition', name: '学科竞赛' },
    { id: 'innovation', name: '创新创业' },
    { id: 'culture', name: '文体活动' },
    { id: 'volunteer', name: '志愿服务' },
    { id: 'lecture', name: '讲座报告' }
  ],
  activities: [
    {
      id: 'a1', name: '大学生创新创业训练计划项目申报', category: 'innovation',
      deadline: '2026-07-20', place: '线上申报', organizer: '教务处',
      participants: 156, desc: '培养大学生创新思维和创业能力，鼓励跨学科跨专业组队。'
    },
    {
      id: 'a2', name: '校园程序设计挑战赛', category: 'competition',
      deadline: '2026-07-15', place: '信息楼D306', organizer: '计算机学院',
      participants: 89, desc: '面向全校学生的程序设计竞赛，考察算法设计与编程能力。'
    },
    {
      id: 'a3', name: '"互联网+"创新创业大赛校内选拔', category: 'innovation',
      deadline: '2026-07-28', place: '实验楼报告厅', organizer: '创新创业学院',
      participants: 210, desc: '选拔优秀项目代表学校参加市赛，欢迎优秀创业团队报名。'
    },
    {
      id: 'a4', name: '青年志愿服务活动报名', category: 'volunteer',
      deadline: '2026-07-10', place: '沙河校区', organizer: '校团委',
      participants: 67, desc: '暑期社区支教、环保宣传等志愿服务活动招募志愿者。'
    },
    {
      id: 'a5', name: '人工智能前沿讲座', category: 'lecture',
      deadline: '2026-07-05', place: 'D101报告厅', organizer: '人工智能学院',
      participants: 320, desc: '特邀知名AI专家分享大模型技术前沿与应用实践。'
    },
    {
      id: 'a6', name: '校园歌手大赛', category: 'culture',
      deadline: '2026-07-18', place: '学生活动中心', organizer: '校学生会',
      participants: 145, desc: '校园歌手大赛海选报名开始，展示你的音乐才艺。'
    }
  ]
};

// ---------- 校园卡消费记录 ----------
const cardData = {
  balance: 86.50,
  todaySpent: 18.00,
  monthSpent: 326.40,
  records: [
    { id: 'r1', name: '一食堂-窗口3', amount: 8.50, time: '2026-07-01 12:15', type: '食堂' },
    { id: 'r2', name: '图书馆打印店', amount: 2.50, time: '2026-07-01 10:30', type: '打印' },
    { id: 'r3', name: '二食堂-面食窗口', amount: 7.00, time: '2026-06-30 18:20', type: '食堂' },
    { id: 'r4', name: '校内超市', amount: 15.50, time: '2026-06-30 14:10', type: '超市' },
    { id: 'r5', name: '一食堂-窗口1', amount: 6.00, time: '2026-06-30 08:00', type: '食堂' },
    { id: 'r6', name: '水卡充值', amount: 20.00, time: '2026-06-29 16:45', type: '充值' }
  ]
};

// ---------- 快递代取 ----------
const expressData = {
  stations: [
    { id: 's1', name: '菜鸟驿站（沙河校区南门）' },
    { id: 's2', name: '京东快递点（校内超市旁）' },
    { id: 's3', name: '顺丰快递点（学生活动中心）' },
    { id: 's4', name: '校门口临时取件点' }
  ],
  basePrice: 5,
  orderStatus: '待接单'
};

// ---------- 宿舍报修类型 ----------
const repairTypes = [
  { id: 'water', name: '水电', icon: '💧' },
  { id: 'door', name: '门窗', icon: '🚪' },
  { id: 'network', name: '网络', icon: '🌐' },
  { id: 'ac', name: '空调', icon: '❄️' },
  { id: 'other', name: '其他', icon: '🔧' }
];

// ---------- 校园服务入口配置 ----------
const serviceEntries = [
  { id: 'library', name: '图书馆预约', icon: '📚', desc: '预约图书馆自习座位', page: '/pages/service-library/service-library' },
  { id: 'classroom', name: '空教室查询', icon: '🏫', desc: '查找校内空闲教室', page: '/pages/service-classroom/service-classroom' },
  { id: 'schedule', name: '我的课表', icon: '📅', desc: '查看本周课程安排', page: '/pages/service-schedule/service-schedule' },
  { id: 'notifications', name: '重要通知', icon: '📢', desc: '学校官方通知公告', page: '/pages/service-notice/service-notice' },
  { id: 'activities', name: '活动比赛', icon: '🏆', desc: '校园活动与竞赛报名', page: '/pages/service-activity/service-activity' },
  { id: 'card', name: '校园卡服务', icon: '💳', desc: '余额查询与充值挂失', page: '/pages/service-card/service-card' },
  { id: 'express', name: '快递代取', icon: '📦', desc: '校内快递代取服务', page: '/pages/service-express/service-express' },
  { id: 'repair', name: '宿舍报修', icon: '🔧', desc: '在线提交报修申请', page: '/pages/service-repair/service-repair' }
];

module.exports = {
  libraryData,
  classroomData,
  scheduleData,
  notificationData,
  activityData,
  cardData,
  expressData,
  repairTypes,
  serviceEntries
};
