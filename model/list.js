import axios from 'axios';

export async function getImageList() {
  try {
    const response = await axios.get('https://img.wuliya.icu/api/list', { timeout: 10000 });

    if (response.data && response.data.data) {
      return response.data.data; 
    } else {
      throw new Error('获取图片集列表失败');
    }
  } catch (error) {
    // 处理超时或其他错误
    if (error.code === 'ECONNABORTED') {
      throw new Error('获取图片集列表失败');
    }
  }
}
