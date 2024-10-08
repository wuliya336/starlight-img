import { getImageList } from '../model/index.js';
import { Common } from '../components/index.js';

export class imginfo extends plugin {
  constructor() {
    super({
      name: '星点图片:随机图片列表',
      event: 'message',
      priority: -20,
      rule: [
        {
          reg: /(#)?星点图片列表$/i,
          fnc: 'imginfo',
        }
      ],
    });
  }

  async imginfo(e) {
    const imageList = await getImageList();

    await Common.render('img/index', {
      imgList: imageList
    }, { e, scale: 1.4 });
  }
}
