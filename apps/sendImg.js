import { getRandomImages } from '../model/index.js';
import { Config } from '../components/index.js';

export class sendImg extends plugin {
  constructor() {
    super({
      name: '星点图片:随机图片',
      event: 'message',
      priority: -20,
      rule: [
        {
          reg: /#?随机(?:图片)?(.*?)(\d*)$/i,
          fnc: 'sendimg',
        }
      ],
    });
  }

  async sendimg(e) {
    if (!Config.img) {
      return false;
    }

    const match = e.msg.match(/#?随机(?:图片)?(.*?)(\d*)$/i);
    const name = match[1] ? match[1].trim() : ''; 
    const count = match[2] ? parseInt(match[2]) : 1;

    const result = await getRandomImages(name, count);

    if (result.code === 200) {
      const images = result.images;

      if (count === 1) {
        await e.reply({ type: 'image', file: images[0].imgurl });
      } else {
        const title = name ? `随机${name}` : `随机图片`;

        const titleNode = {
          message: [
            {
              type: 'text',
              text: title,
            }
          ],
          nickname: '星点图片',
          user_id: Bot.uin,
        };

        const imageNode = images.map((img) => ({
          message: [
            {
              type: 'image',
              file: img.imgurl,
            }
          ],
          nickname: '星点图片',
          user_id: Bot.uin,
        }));

        const forwardNodes = [titleNode, ...imageNode];
        const forwardMsg = await Bot.makeForwardMsg(forwardNodes);

        if (forwardMsg) {
          await e.reply(forwardMsg);
        }
      }
    } else {
      e.reply('获取失败');
    }
  }
}
