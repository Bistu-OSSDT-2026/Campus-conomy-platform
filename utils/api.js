/**
 * API 配置文件
 * 统一管理所有 API 地址
 */

// 开发环境
const API_BASE = 'http://127.0.0.1:3000';
// 生产环境（小程序上线后使用）
// const API_BASE = 'https://your-domain.com';

const API = {
  // 认证
  AUTH: {
    LOGIN: `${API_BASE}/api/auth/login`,
    REGISTER: `${API_BASE}/api/auth/register`,
    CERTIFICATION: `${API_BASE}/api/auth/certification`
  },
  
  // 商品
  PRODUCTS: {
    LIST: `${API_BASE}/api/products`,
    DETAIL: (id) => `${API_BASE}/api/products/${id}`,
    STATUS: (id) => `${API_BASE}/api/products/${id}/status`
  },
  
  // 订单
  ORDERS: {
    CREATE: `${API_BASE}/api/orders`,
    DETAIL: (id) => `${API_BASE}/api/orders/${id}`,
    STATUS: (id) => `${API_BASE}/api/orders/${id}/status`
  },
  
  // 用户
  USERS: {
    INFO: (id) => `${API_BASE}/api/users/${id}`,
    UPDATE: (id) => `${API_BASE}/api/users/${id}`,
    PASSWORD: (id) => `${API_BASE}/api/users/${id}/password`,
    PRODUCTS: (id) => `${API_BASE}/api/users/${id}/products`,
    FAVORITES: (id) => `${API_BASE}/api/users/${id}/favorites`,
    REPORTS: (id) => `${API_BASE}/api/users/${id}/reports`,
    ORDERS: (id) => `${API_BASE}/api/users/${id}/orders`,
    SOLD_ORDERS: (id) => `${API_BASE}/api/users/${id}/sold-orders`
  },
  
  // 收藏
  FAVORITES: `${API_BASE}/api/favorites`,
  
  // 举报
  REPORTS: {
    CREATE: `${API_BASE}/api/reports`,
    LIST: `${API_BASE}/api/admin/reports`,
    HANDLE: (id) => `${API_BASE}/api/admin/reports/${id}`
  },
  
  // 学校
  SCHOOLS: `${API_BASE}/api/schools`
};

module.exports = { API, API_BASE };
