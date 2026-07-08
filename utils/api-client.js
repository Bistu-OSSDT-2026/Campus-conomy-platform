/**
 * API 客户端 - 基于 fetch 的统一请求封装
 * 
 * 使用方式（浏览器 / preview.html）：
 *   直接引入本文件即可使用 window.ApiClient
 * 
 * 使用方式（微信小程序）：
 *   在小程序 utils/ 下引用，将 fetch 替换为 wx.request
 */

const API_BASE = 'http://127.0.0.1:3000';

/**
 * 统一请求器
 * @param {string} method - GET/POST/PUT/DELETE
 * @param {string} url  - 接口路径（相对 API_BASE）
 * @param {object} data - 请求体（GET 时自动转为 query string）
 * @returns {Promise<{code, msg, data}>}
 */
async function request(method, url, data = null) {
  let fullUrl = API_BASE + url;
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (method === 'GET' && data) {
    const qs = Object.keys(data)
      .filter(k => data[k] !== undefined && data[k] !== null && data[k] !== '')
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
      .join('&');
    if (qs) fullUrl += '?' + qs;
  } else if (data) {
    opts.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(fullUrl, opts);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('[ApiClient] 请求失败:', method, url, err.message);
    return { code: -1, msg: '网络错误: ' + err.message, data: null };
  }
}

// ==================== 导出 API 集合 ====================
const ApiClient = {
  // ---------- 认证 ----------
  auth: {
    /** 登录 - account 为手机号或邮箱 */
    login(account, password) {
      return request('POST', '/api/auth/login', { account, password });
    },
    /** 注册 */
    register(phone, email, password, nickname) {
      return request('POST', '/api/auth/register', { phone, email, password, nickname });
    },
    /** 校园认证 */
    certification(userId, school, campus, grade, major, studentNo, contact) {
      return request('POST', '/api/auth/certification', {
        userId, school, campus, grade, major, studentNo, contact
      });
    }
  },

  // ---------- 商品 ----------
  products: {
    /** 获取商品列表（支持筛选） */
    list(filters = {}) {
      return request('GET', '/api/products', filters);
    },
    /** 获取商品详情（自动 views+1） */
    detail(id) {
      return request('GET', '/api/products/' + id);
    },
    /** 发布商品 */
    create(data) {
      return request('POST', '/api/products', data);
    },
    /** 编辑商品 */
    update(id, data) {
      return request('PUT', '/api/products/' + id, data);
    },
    /** 删除商品 */
    remove(id, userId) {
      return request('DELETE', '/api/products/' + id + '?userId=' + userId);
    },
    /** 修改商品状态 */
    setStatus(id, status, userId) {
      return request('PUT', '/api/products/' + id + '/status', { status, userId });
    }
  },

  // ---------- 订单 ----------
  orders: {
    /** 提交订单 */
    create(productId, buyerId, quantity, remark) {
      return request('POST', '/api/orders', { productId, buyerId, quantity, remark });
    },
    /** 查看订单详情 */
    detail(id) {
      return request('GET', '/api/orders/' + id);
    },
    /** 修改订单状态 */
    setStatus(id, status, userId) {
      return request('PUT', '/api/orders/' + id + '/status', { status, userId });
    }
  },

  // ---------- 用户 ----------
  users: {
    /** 获取用户信息 */
    info(id) {
      return request('GET', '/api/users/' + id);
    },
    /** 更新用户资料 */
    update(id, data) {
      return request('PUT', '/api/users/' + id, data);
    },
    /** 修改密码 */
    changePassword(id, oldPassword, newPassword, confirmPassword) {
      return request('PUT', '/api/users/' + id + '/password', {
        oldPassword, newPassword, confirmPassword
      });
    },
    /** 我的发布 */
    myProducts(id) {
      return request('GET', '/api/users/' + id + '/products');
    },
    /** 我的收藏 */
    myFavorites(id) {
      return request('GET', '/api/users/' + id + '/favorites');
    },
    /** 我的购买订单 */
    myOrders(id) {
      return request('GET', '/api/users/' + id + '/orders');
    },
    /** 我的售出订单 */
    mySoldOrders(id) {
      return request('GET', '/api/users/' + id + '/sold-orders');
    }
  },

  // ---------- 收藏 ----------
  favorites: {
    /** 添加收藏 */
    add(userId, productId) {
      return request('POST', '/api/favorites', { userId, productId });
    },
    /** 取消收藏 */
    remove(userId, productId) {
      return request('DELETE', '/api/favorites', { userId, productId });
    }
  },

  // ---------- 举报 ----------
  reports: {
    /** 提交举报 */
    create(productId, reporterId, reason, description) {
      return request('POST', '/api/reports', { productId, reporterId, reason, description });
    },
    /** 管理员查看全部举报 */
    list(adminId) {
      return request('GET', '/api/admin/reports', { adminId });
    },
    /** 管理员处理举报 */
    handle(id, adminId, status, adminResult) {
      return request('PUT', '/api/admin/reports/' + id, { adminId, status, adminResult });
    }
  },

  // ---------- 学校 ----------
  schools: {
    list(keyword) {
      return request('GET', '/api/schools', keyword ? { keyword } : {});
    }
  },

  // ---------- 健康检查 ----------
  health() {
    return request('GET', '/api/health');
  }
};

// 挂载到全局（浏览器环境），也支持 CommonJS（Node/小程序）
if (typeof window !== 'undefined') {
  window.ApiClient = ApiClient;
  window.API_BASE = API_BASE;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ApiClient, API_BASE };
}
