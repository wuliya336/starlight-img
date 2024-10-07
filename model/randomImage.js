import axios from 'axios';
import { getImageList } from './index.js';

/**
 * 根据名称或随机获取图片集
 * @param {string} name - 图片集名称，可选。如果为空，则随机选择一个图片集。
 * @returns {Promise<Object>} 返回找到的图片集。
 */
async function getImageCollection(name = '') {
  const dataList = await getImageList();

  if (name) {
    const selectedItem = dataList.find(item => item.name === name || item.alias === name);
    if (!selectedItem) {
      return null; 
    }
    return selectedItem;
  }

  return dataList[Math.floor(Math.random() * dataList.length)];
}

/**
 * 根据给定图片集的别名获取图片
 * @param {string} alias - 图片集别名
 * @param {number} count - 图片数量
 * @returns {Promise<Array>} 返回图片数组
 */
async function fetchImages(alias, count) {
  const apiUrl = `https://img.wuliya.icu/api/${alias}?type=json&num=1`;
  const requests = Array.from({ length: count }, () => axios.get(apiUrl, { timeout: 10000 }));
  const responses = await Promise.allSettled(requests);

  return responses
    .filter(response => response.status === 'fulfilled' && response.value.data.code === 200)
    .flatMap(response => response.value.data.images);
}

/**
 * 获取随机图片或指定图片集的图片，支持并行处理多个请求。
 * 
 * @param {string} name - 图片集名称，可选。如果为空，则随机选择一个图片集。
 * @param {number} count - 需要的图片数量，默认为 1。
 * @returns {Object} 包含请求状态码和图片列表。
 */
export async function getRandomImages(name = '', count = 1) {
  const selectedItem = await getImageCollection(name);

  if (!selectedItem) {
    return { code: 404, message: '未找到指定的图片集' };  
  }

  const images = await fetchImages(selectedItem.alias, count);

  if (images.length > 0) {
    return { code: 200, images };
  } else {
    return { code: 204, message: '没有返回任何图片' };
  }
}
