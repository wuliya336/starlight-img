import { getRandomImages } from '../model/index.js';
import common from '../../../lib/common/common.js';
import { Config } from '../components/index.js';

export class sendImg extends plugin {
  constructor() {
    super({
      name: '星点图片:随机图片',
      event: 'message',
      priority: -20,
      rule: [
        {
          reg: /(#)?随机(图片)?(.*?)(\d*)$/i, 
          fnc: 'sendimg',
        }
      ],
    });
  }

  async sendimg(e) {
    if (!Config.img) {
      return false;
    }

    const match = e.msg.match(/#随机(?:图片)?(.*?)(\d*)$/i); 
    const name = match[1] ? match[1].trim() : ''; 
    const count = match[2] ? parseInt(match[2]) : 1; 

    const result = await getRandomImages(name, count);
    if (result.code === 200) {
      const images = result.images;

      if (count === 1) {
        const img = images[0].imgurl;
        await e.reply(segment.image(img)); 
      } else {
        const forwardMsg = await Promise.all(
          images.map(async (img) => {
            return segment.image(img.imgurl); 
          })
        );

        const title = name ? `随机${name}` : `随机图片`;
        await e.reply(common.makeForwardMsg(e, forwardMsg, title));
      }
    } else {
      const title = name ? `随机${name}` : `随机图片`;
      e.reply(`${title} 请求失败`);
    }
  }
}
