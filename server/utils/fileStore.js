/**
 * 工具函数 - JSON 文件存储
 * 用 JSON 文件模拟数据库，方便小白理解和结课展示
 */

const fs = require('fs');
const path = require('path');

// data 目录路径
const DATA_DIR = path.join(__dirname, '..', 'data');

// 确保 data 目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * 读取 JSON 文件
 * @param {string} filename - 文件名（不含路径），如 'users.json'
 * @returns {Array|Object} 解析后的数据，文件不存在则返回空数组
 */
function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      console.log(`[fileStore] ✅ 读取 ${filename} 成功，共 ${Array.isArray(data) ? data.length : 1} 条记录`);
      return data;
    } else {
      console.log(`[fileStore] ⚠️ ${filename} 不存在，返回空数组`);
    }
  } catch (err) {
    console.error('========================================');
    console.error(`[fileStore] ❌ 读取 ${filename} 失败！JSON 格式错误！`);
    console.error(`[fileStore] ❌ 文件路径：${filePath}`);
    console.error(`[fileStore] ❌ 错误信息：${err.message}`);
    console.error(`[fileStore] ❌ 请检查 ${filename} 中是否有：尾随逗号、缺失引号、注释等非法 JSON 内容`);
    console.error('========================================');
  }
  // 文件不存在或读取失败，返回空数组
  return [];
}

/**
 * 写入 JSON 文件（格式化缩进，方便查看）
 * @param {string} filename - 文件名
 * @param {Array|Object} data - 要写入的数据
 */
function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    // 格式化缩进 2 空格，方便查看
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, json, 'utf-8');
    return true;
  } catch (err) {
    console.error(`写入 ${filename} 失败:`, err.message);
    return false;
  }
}

/**
 * 根据 id 查找数据项
 * @param {Array} list - 数据列表
 * @param {string} id - 要查找的 id
 * @returns {Object|undefined} 找到的数据项
 */
function findById(list, id) {
  return list.find(item => item.id === id);
}

/**
 * 根据 id 查找数据项索引
 * @param {Array} list - 数据列表
 * @param {string} id - 要查找的 id
 * @returns {number} 索引，未找到返回 -1
 */
function findIndexById(list, id) {
  return list.findIndex(item => item.id === id);
}

module.exports = {
  readJSON,
  writeJSON,
  findById,
  findIndexById,
  DATA_DIR
};
