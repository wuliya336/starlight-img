import { getImageList } from '../model/index.js';
import { Common } from '../components/index.js'

export class imglist extends plugin {
  constructor() {
    super({
      name: '星点图片:随机图片列表',
      event: 'message',
      priority: -20,
      rule: [
        {
          reg: /(#)?星点图片列表$/i,
          fnc: 'imglist',
        }
      ],
    });
  }

  async imglist(e) {
    try {
      const imageList = await getImageList();
      const imgList = imageList.map(image => image.name);

      await Common.render('imglist/index', {
        imgList
      }, { e, scale: 1.4 });
    } catch (error) {
      console.error('Error fetching image list:', error);
    }
  }
}
