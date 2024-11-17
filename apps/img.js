import { getImageList } from "../model/index.js";
import { Common } from "../components/index.js";

export class img extends plugin {
  constructor() {
    super({
      name: "星点图片:随机图片",
      event: "message",
      priority: -20,
      rule: [
        {
          reg: /(#)?星点图片列表$/i,
          fnc: "imginfo",
        },
        {
          reg: /(#)?(星点图片|starlight-img)(数量)?(排行)(榜)?$/i,
          fnc: "imglist",
        },
        {
          reg: /(#)?(星点图片|starlight-img)(随机)?(\S+)(图片)?(数量)$/i,
          fnc: "imgnum",
        },
      ],
    });
  }

  async imginfo(e) {
    let imageList = await getImageList();
    await Common.render(
      "img/index",
      {
        imginfo: imageList,
      },
      { e, scale: 1.4 },
    );
  }

  async imglist(e) {
    let imageList = await getImageList();
    imageList = imageList.sort((a, b) => b.num - a.num);
    await Common.render(
      "img/list",
      {
        imglist: imageList,
      },
      { e, scale: 1.4 },
    );
  }

  async imgnum(e) {
    const match = e.msg.match(
      /(#)?(星点图片|starlight-img)(随机)?(\S+)(图片)?(数量)$/i,
    );

    const name = match ? match[4] : "";

    if (!name) {
      e.reply("请提供有效的图片名称。");
      return;
    }

    let imageList = await getImageList();
    let selectedImage = imageList.find(
      (item) => item.name === name || item.alias === name,
    );

    if (!selectedImage) {
      e.reply(`没有找到与 ${name} 相关的图片。`);
      return;
    }

    await Common.render(
      "img/num",
      {
        imginfo: selectedImage,
      },
      { e, scale: 1.4 },
    );
  }
}
