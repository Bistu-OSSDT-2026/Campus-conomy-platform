/**
 * 工具函数 - 生成唯一ID和时间字符串
 */

// 生成唯一ID：前缀 + 时间戳 + 随机数
function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix + timestamp + random;
}

// 获取当前时间字符串 (yyyy-MM-dd HH:mm:ss)
function getNow() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}:${s}`;
}

// 生成订单编号 OD + 年月日时分秒 + 随机数
function generateOrderId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `OD${y}${m}${day}${h}${min}${s}${random}`;
}

module.exports = {
  generateId,
  getNow,
  generateOrderId
};
