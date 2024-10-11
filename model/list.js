import axios from 'axios';

export async function getImageList() {
  const apiUrl = 'https://img.wuliya336.top/api/list';

  const response = await axios.get(apiUrl, { timeout: 20000 }).catch(() => {
    console.error('获取随机图API信息失败');
    return null; 
  });

  if (response && response.data && response.data.data) {
    return response.data.data;
  } else {
    console.error('获取随机图API信息失败');
    return null;
  }
}
