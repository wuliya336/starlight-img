import { update } from "../../other/update.js";

export class update extends plugin {
  constructor() {
    super({
      name: "星点图片:更新",
      event: "message",
      priority: -20,
      rule: [
        {
          reg: /(#)?(星点图片|starlight)(插件)?(强制)?更新$/i,
          fnc: "update"
        }
      ]
    });
  }

  async UpdateUrl(e, remoteUrl) {
    const updateInstance = new update(e);
    return new Proxy(updateInstance, {
      get(target, prop) {
        if (prop === "getRemoteUrl") {
          return async function(branch, hide, ...args) {
            return remoteUrl || target.getRemoteUrl(branch, hide, ...args);
          };
        }
        return target[prop];
      }
    });
  }

  async update(e = this.e) {
    const remoteUrl = "https://github.com/wuliya336/starlight-img.git";

    e.msg = `#${e.msg.includes("强制") ? "强制" : ""}更新starlight-img`;

    const up = await this.UpdateUrl(e, remoteUrl);
    up.e = e;

    return up.update();  
  }
}
