const app = getApp();

Page({
  data: {
    goodsList: [],
    onlineCount: 0
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const currentUser = app.globalData.userInfo;
    // 演示兜底：没有登录用户时使用默认 u001
    const userId = (currentUser && currentUser.id) ? currentUser.id : 'u001';
    console.log('[我的发布] 用户ID:', userId, currentUser ? currentUser.nickname : '(默认演示)');

    // 优先从后端获取
    wx.request({
      url: `http://127.0.0.1:3000/api/users/${userId}/products`,
      method: 'GET',
      success: (res) => {
        console.log('[我的发布] 后端返回:', res.statusCode, (res.data && res.data.data) ? res.data.data.length : 0, '条');
        let serverProducts = [];
        if (res.statusCode === 200 && res.data && res.data.code === 200) {
          serverProducts = res.data.data || [];
        }
        this._renderMyPosts(serverProducts, userId);
      },
      fail: () => {
        console.log('[我的发布] 后端请求失败，使用本地数据');
        this._renderMyPosts([], userId);
      }
    });
  },

  _renderMyPosts(serverProducts, userId) {
    // 读取本地缓存
    let localProducts = [];
    try {
      const allLocal = wx.getStorageSync('localProducts') || [];
      localProducts = allLocal.filter(p => String(p.publisherId) === String(userId));
    } catch (e) {
      localProducts = [];
    }

    // 后端商品 → 前端格式
    const serverGoods = serverProducts.map(p => ({
      id: p.id,
      title: p.title,
      desc: p.description || '',
      price: p.price,
      originalPrice: p.originalPrice || 0,
      categoryName: p.category || '',
      images: p.images || [],
      cover: (p.images && p.images.length > 0) ? p.images[0] : '/images/goods-default.png',
      seller: { id: p.publisherId, name: p.publisherName, avatar: p.publisherAvatar || '/images/avatar1.png', school: p.school || '', verified: true },
      status: p.status === '在售' ? 'published' : (p.status === '已下架' ? 'removed' : 'completed'),
      tradePlace: p.tradeLocation || '',
      viewCount: p.views || 0,
      favCount: p.favoriteCount || 0,
      publishTime: p.createdAt || '',
      createdAt: p.createdAt || ''
    }));

    // 本地商品 → 前端格式
    const localGoods = localProducts.map(p => ({
      id: p.id,
      title: p.title,
      desc: p.description || '',
      price: p.price,
      originalPrice: 0,
      categoryName: p.category || '',
      images: p.images || [],
      cover: (p.images && p.images.length > 0) ? p.images[0] : '/images/goods-default.png',
      seller: { id: p.publisherId, name: p.publisherName, avatar: p.publisherAvatar || '/images/avatar1.png', school: p.school || '', verified: true },
      status: 'published',
      tradePlace: p.tradeLocation || '',
      viewCount: p.views || 0,
      favCount: p.favoriteCount || 0,
      publishTime: p.createdAt || '',
      createdAt: p.createdAt || ''
    }));

    // 去重合并（后端优先）
    const mergedMap = new Map();
    localGoods.forEach(g => mergedMap.set(g.id, g));
    serverGoods.forEach(g => mergedMap.set(g.id, g));

    const goodsList = Array.from(mergedMap.values());
    goodsList.sort((a, b) => {
      const tA = a.createdAt || '';
      const tB = b.createdAt || '';
      return tB.localeCompare(tA);
    });

    const onlineCount = goodsList.filter(g => g.status === 'published').length;
    console.log('[我的发布] 合并后共', goodsList.length, '条，在售', onlineCount, '条');
    this.setData({ goodsList, onlineCount });
  },

  onGoodsTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  onDeletePost(e) {
    const id = e.currentTarget.dataset.id;
    console.log('[删除] 准备删除商品, id:', id);
    wx.showModal({
      title: '删除商品',
      content: '确定要删除该商品吗？',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (!res.confirm) return;

        // 1. 加入 deletedProductIds 兜底（保证首页/详情页不再显示）
        try {
          const deletedIds = wx.getStorageSync('deletedProductIds') || [];
          if (!deletedIds.includes(String(id))) {
            deletedIds.push(String(id));
            wx.setStorageSync('deletedProductIds', deletedIds);
          }
        } catch (e) {}

        // 2. 从 localProducts 缓存中删除
        this._removeFromLocalProducts(id);

        // 3. 从 globalData.goodsList 移除
        this._removeFromGlobalAndFavorites(id);

        // 4. 判断来源：本地商品直接完成，后端商品尝试调接口
        const isLocal = String(id).startsWith('local_');

        if (isLocal) {
          // 纯本地商品，直接完成
          this.loadData();
          wx.showToast({ title: '删除成功', icon: 'success' });
        } else {
          // 后端商品，尝试调 DELETE 接口
          wx.request({
            url: 'http://127.0.0.1:3000/api/products/' + id,
            method: 'DELETE',
            success: () => {
              console.log('[删除] 后端删除成功, id:', id);
            },
            fail: () => {
              console.log('[删除] 后端删除失败，已从本地缓存标记删除, id:', id);
            },
            complete: () => {
              this.loadData();
              wx.showToast({ title: '删除成功', icon: 'success' });
            }
          });
        }
      }
    });
  },

  _removeFromLocalProducts(id) {
    try {
      let localProducts = wx.getStorageSync('localProducts') || [];
      localProducts = localProducts.filter(p => String(p.id) !== String(id));
      wx.setStorageSync('localProducts', localProducts);
      console.log('[删除] 已从 localProducts 移除, id:', id);
    } catch (e) {
      console.error('[删除] 移除 localProducts 异常:', e);
    }
  },

  _removeFromGlobalAndFavorites(id) {
    const appData = getApp().globalData;
    const idx = appData.goodsList.findIndex(g => String(g.id) === String(id));
    if (idx > -1) {
      appData.goodsList.splice(idx, 1);
      console.log('[删除] 已从 globalData.goodsList 移除, id:', id);
    }
    const favIdx = appData.favorites.indexOf(id);
    if (favIdx > -1) {
      appData.favorites.splice(favIdx, 1);
      wx.setStorageSync('favorites', appData.favorites);
    }
  },

  onGoPublish() {
    wx.switchTab({ url: '/pages/publish/publish' });
  }
});
