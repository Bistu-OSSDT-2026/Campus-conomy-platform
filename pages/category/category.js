const app = getApp();

Page({
  data: {
    categories: [],
    activeCategory: 0,
    currentCategoryName: '全部商品',
    filteredGoods: [],
    allGoods: []
  },

  onLoad() {
    this.initData();
  },

  onShow() {
    this.initData();
    // 检查是否有从首页传来的分类筛选
    const activeCategory = wx.getStorageSync('activeCategory');
    if (activeCategory) {
      wx.removeStorageSync('activeCategory');
      this.setData({ activeCategory: activeCategory.id });
      this.setData({ currentCategoryName: activeCategory.name });
      this.filterGoods();
    }
  },

  initData() {
    const categories = app.globalData.categories || [];
    const allGoods = app.globalData.goodsList.filter(g => g.status === 'published') || [];

    // 计算每个分类的商品数量
    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      count: allGoods.filter(g => g.categoryId === cat.id).length
    }));

    this.setData({
      categories: categoriesWithCount,
      allGoods: allGoods
    });

    this.filterGoods();
  },

  onCategoryChange(e) {
    const id = e.currentTarget.dataset.id;
    const cat = this.data.categories.find(c => c.id === id);
    this.setData({
      activeCategory: id,
      currentCategoryName: id === 0 ? '全部商品' : (cat ? cat.name : '全部商品')
    });
    this.filterGoods();
  },

  filterGoods() {
    const { activeCategory, allGoods } = this.data;
    let filtered;
    if (activeCategory === 0) {
      filtered = allGoods;
    } else {
      filtered = allGoods.filter(g => g.categoryId === activeCategory);
    }
    this.setData({ filteredGoods: filtered });
  },

  onSearch() {
    wx.showModal({
      title: '搜索',
      content: '请输入搜索关键词',
      editable: true,
      placeholderText: '搜索商品...',
      success: (res) => {
        if (res.confirm && res.content) {
          const keyword = res.content.toLowerCase();
          const filtered = this.data.allGoods.filter(g =>
            g.title.toLowerCase().includes(keyword) ||
            g.desc.toLowerCase().includes(keyword)
          );
          this.setData({ filteredGoods: filtered });
          wx.showToast({ title: `找到${filtered.length}件`, icon: 'none' });
        }
      }
    });
  },

  onGoodsTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  }
});
