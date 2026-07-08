const app = getApp();

Page({
  data: {
    isLoggedIn: false,
    isVerified: false,
    publishTypes: [
      { id: 'sell', name: '闲置出售', icon: '💰' },
      { id: 'buy', name: '求购', icon: '🛒' },
      { id: 'service', name: '技能服务', icon: '🎓' },
      { id: 'agent', name: '代购跑腿', icon: '🏃' },
      { id: 'rent', name: '租赁', icon: '📋' },
      { id: 'free', name: '免费赠送', icon: '🎁' }
    ],
    categoryNames: [],
    conditionList: ['全新', '九九新', '九五新', '九成新', '八成新', '七成新', '六成新及以下'],
    form: {
      type: 'sell',
      images: [],
      title: '',
      categoryId: 0,
      categoryName: '',
      price: '',
      originalPrice: '',
      condition: '',
      tradePlace: '',
      desc: '',
      contact: ''
    },
    loading: false
  },

  onLoad() {
    const categoryNames = (app.globalData.categories || []).map(c => c.name);
    this.setData({ categoryNames });
  },

  onShow() {
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn,
      isVerified: app.globalData.isVerified
    });
    // 预填联系方式
    if (app.globalData.userInfo) {
      this.setData({ 'form.contact': app.globalData.userInfo.contact || '' });
    }
  },

  onTypeChange(e) {
    this.setData({ 'form.type': e.currentTarget.dataset.type });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onCategoryChange(e) {
    const idx = e.detail.value;
    const categories = app.globalData.categories;
    this.setData({
      'form.categoryId': categories[idx].id,
      'form.categoryName': categories[idx].name
    });
  },

  onConditionChange(e) {
    this.setData({ 'form.condition': this.data.conditionList[e.detail.value] });
  },

  // 添加图片（模拟）
  onAddImage() {
    wx.chooseImage({
      count: 9 - this.data.form.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const images = this.data.form.images.concat(res.tempFilePaths);
        this.setData({ 'form.images': images });
      }
    });
  },

  onPreviewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.form.images[index],
      urls: this.data.form.images
    });
  },

  onDeleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.form.images;
    images.splice(index, 1);
    this.setData({ 'form.images': images });
  },

  // 发布
  onPublish() {
    console.log('[发布] 点击了立即发布按钮');

    const { form } = this.data;

    // 表单校验
    if (form.images.length === 0) {
      wx.showToast({ title: '请上传至少一张图片', icon: 'none' });
      return;
    }
    if (!form.title || form.title.trim().length < 2) {
      wx.showToast({ title: '标题至少2个字', icon: 'none' });
      return;
    }
    if (!form.categoryName) {
      wx.showToast({ title: '请选择分类', icon: 'none' });
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      wx.showToast({ title: '请输入有效的售价', icon: 'none' });
      return;
    }
    if (!form.condition) {
      wx.showToast({ title: '请选择成色', icon: 'none' });
      return;
    }
    if (!form.desc || form.desc.trim().length < 10) {
      wx.showToast({ title: '描述至少10个字', icon: 'none' });
      return;
    }

    // 发布者身份（演示兜底）
    const userInfo = app.globalData.userInfo;
    const isLoggedIn = app.globalData.isLoggedIn && userInfo;
    const publisherId = isLoggedIn ? userInfo.id : 'u001';
    const publisherName = isLoggedIn ? (userInfo.nickname || '') : '吕泽卿';
    const publisherAvatar = isLoggedIn ? (userInfo.avatar || '/images/default-avatar.png') : '/images/avatar/lvzeqing.jpg';
    const school = isLoggedIn ? (userInfo.school || '') : '北京信息科技大学';
    const campus = isLoggedIn ? (userInfo.campus || '') : '沙河校区';
    const contact = form.contact || (isLoggedIn ? (userInfo.contact || '') : '13800001111');
    const localId = 'local_' + Date.now();
    const nowStr = app.formatTime(new Date());

    this.setData({ loading: true });

    // 组装完整商品数据
    const productData = {
      id: localId,
      title: form.title.trim(),
      category: form.categoryName,
      price: parseFloat(form.price),
      images: form.images,
      description: form.desc.trim(),
      school: school,
      campus: campus,
      tradeLocation: form.tradePlace || '校内面交',
      contact: contact,
      negotiable: true,
      publisherId: publisherId,
      publisherName: publisherName,
      publisherAvatar: publisherAvatar,
      status: '在售',
      views: 0,
      favoriteCount: 0,
      reportCount: 0,
      createdAt: nowStr,
      updatedAt: nowStr
    };

    console.log('准备发布商品：', productData);

    // 保存到本地并完成发布（公共函数）
    const saveToLocalAndFinish = () => {
      try {
        const localProducts = wx.getStorageSync('localProducts') || [];
        localProducts.unshift(productData);
        wx.setStorageSync('localProducts', localProducts);
        console.log('后端不可用，已保存到本地演示数据：', productData);
      } catch (e) {
        console.error('本地保存异常：', e);
      }

      // 同步到 globalData.goodsList，让首页能立即看到
      const localGoods = {
        id: productData.id,
        title: productData.title,
        desc: productData.description,
        price: productData.price,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : 0,
        categoryId: form.categoryId,
        categoryName: form.categoryName,
        images: productData.images.length > 0 ? productData.images : ['/images/goods-default.png'],
        cover: productData.images.length > 0 ? productData.images[0] : '/images/goods-default.png',
        seller: {
          id: publisherId,
          name: publisherName,
          avatar: publisherAvatar,
          school: school,
          grade: isLoggedIn ? (userInfo.grade || '') : '2025级',
          verified: true
        },
        status: 'published',
        type: form.type,
        condition: form.condition,
        tradePlace: productData.tradeLocation,
        contact: productData.contact,
        viewCount: 0,
        favCount: 0,
        publishTime: productData.createdAt,
        createdAt: productData.createdAt
      };
      app.globalData.goodsList.unshift(localGoods);

      // 记录我的发布
      try {
        const myPosts = wx.getStorageSync('myPosts') || [];
        myPosts.unshift(productData.id);
        wx.setStorageSync('myPosts', myPosts);
      } catch (e) {}

      wx.showToast({ title: '商品上传成功', icon: 'success' });

      // 重置表单并跳转
      setTimeout(() => {
        this.setData({
          form: {
            type: 'sell', images: [], title: '', categoryId: 0, categoryName: '',
            price: '', originalPrice: '', condition: '', tradePlace: '', desc: '', contact: contact
          }
        });
        wx.switchTab({ url: '/pages/home/home' });
      }, 1000);
    };

    // 优先尝试保存到后端
    wx.request({
      url: 'http://127.0.0.1:3000/api/products',
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: productData,
      success: (res) => {
        this.setData({ loading: false });
        console.log('后端发布返回：statusCode=' + res.statusCode, res.data);
        if ((res.statusCode === 200 || res.statusCode === 201) && res.data && (res.data.code === 200 || res.data.code === 201)) {
          // 后端成功
          const serverP = res.data.data;
          productData.id = serverP.id;
          console.log('后端发布成功：', serverP);

          const localGoods = {
            id: productData.id,
            title: productData.title,
            desc: productData.description,
            price: productData.price,
            originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : 0,
            categoryId: form.categoryId,
            categoryName: form.categoryName,
            images: productData.images.length > 0 ? productData.images : ['/images/goods-default.png'],
            cover: productData.images.length > 0 ? productData.images[0] : '/images/goods-default.png',
            seller: { id: publisherId, name: publisherName, avatar: publisherAvatar, school: school, grade: isLoggedIn ? (userInfo.grade || '') : '2025级', verified: true },
            status: 'published', type: form.type, condition: form.condition,
            tradePlace: serverP.tradeLocation || productData.tradeLocation,
            contact: serverP.contact || productData.contact,
            viewCount: 0, favCount: 0, publishTime: serverP.createdAt || productData.createdAt, createdAt: serverP.createdAt || productData.createdAt
          };
          app.globalData.goodsList.unshift(localGoods);

          try {
            const myPosts = wx.getStorageSync('myPosts') || [];
            myPosts.unshift(productData.id);
            wx.setStorageSync('myPosts', myPosts);
          } catch (e) {}

          wx.showToast({ title: '商品上传成功', icon: 'success' });
          setTimeout(() => {
            this.setData({
              form: { type: 'sell', images: [], title: '', categoryId: 0, categoryName: '', price: '', originalPrice: '', condition: '', tradePlace: '', desc: '', contact: contact }
            });
            wx.switchTab({ url: '/pages/home/home' });
          }, 1000);
        } else {
          // 后端返回业务错误 → 降级到本地保存
          console.log('后端返回异常（code=' + (res.data ? res.data.code : '?') + '），降级到本地保存');
          saveToLocalAndFinish();
        }
      },
      fail: () => {
        this.setData({ loading: false });
        // 后端不通 → 降级到本地保存
        saveToLocalAndFinish();
      }
    });
  },

  onGoLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  onGoVerify() {
    wx.navigateTo({ url: '/pages/verify/verify' });
  }
});
