import axios from 'axios';
import { getImageList } from './index.js';

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

async function fetchImages(alias, count) {
  const apiUrl = `https://img.wuliya.icu/api/${alias}?type=json&num=1`;
  const requests = Array.from({ length: count }, () => axios.get(apiUrl, { timeout: 20000 }));
  const responses = await Promise.allSettled(requests);

  return responses
    .filter(response => response.status === 'fulfilled' && response.value.data.code === 200)
    .flatMap(response => response.value.data.images);
}


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
