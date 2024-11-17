import { Config } from "../components/index.js";
import { getRandomImages } from "../model/index.js";

export class pokeSend extends plugin {
  constructor() {
    super({
      name: "星点图片:戳一戳图片",
      dsc: "戳一戳发送图片",
      event: "notice.group.poke",
      priority: -20,
      rule: [
        {
          fnc: "pokeSend",
        },
      ],
    });
  }
  async pokeSend(e) {
    if (!Config.poke) {
      return false;
    }
    if (e.target_id == e.self_id) {
      const { code, images } = await getRandomImages();

      if (code === 200 && images.length > 0) {
        const imageUrl = images[0].imgurl;
        await e.reply(segment.image(imageUrl));
      }

      return true;
    }
  }
}
