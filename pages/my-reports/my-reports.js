const app = getApp();

Page({
  data: {
    reports: []
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const userInfo = app.globalData.userInfo;
    if (!userInfo) {
      this.setData({ reports: [] });
      return;
    }
    // 筛选当前用户的举报记录
    const myReports = (app.globalData.reports || [])
      .filter(r => r.reporterId === userInfo.id)
      .map(r => {
        // 找到被举报的商品标题
        const goods = app.globalData.goodsList.find(g => g.id === r.goodsId);
        return {
          ...r,
          goodsTitle: goods ? goods.title : '已删除的商品',
          statusText: r.status === 'pending' ? '待处理' : r.status === 'resolved' ? '已处理' : '已驳回'
        };
      })
      .sort((a, b) => {
        if (a.time > b.time) return -1;
        if (a.time < b.time) return 1;
        return 0;
      });

    this.setData({ reports: myReports });
  },

  onTapReport(e) {
    const report = e.currentTarget.dataset.report;
    const statusMap = {
      pending: '待处理',
      resolved: '已处理',
      rejected: '已驳回'
    };
    const resultText = report.result ? ('\n处理结果：' + report.result) : '';
    wx.showModal({
      title: '举报详情',
      content: '被举报内容：' + report.goodsTitle +
        '\n举报原因：' + report.reason +
        '\n举报时间：' + report.time +
        '\n处理状态：' + (statusMap[report.status] || '未知') +
        resultText,
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
