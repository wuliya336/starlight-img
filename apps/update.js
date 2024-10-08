import { update as Update } from "../../other/update.js";
import { Plugin_Name } from "../components/index.js"; 

const remoteUrl = "https://github.com/wuliya336/starlight-img";

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
        },
        {
          reg: /^#星点图片(插件)?更新日志$/i, 
          fnc: "sendLog"
        }
      ]
    });
  }

  async initUpdate(e, Plugin_Name, remoteUrl) {
    const updateInstance = new Update(e);

    return new Proxy(updateInstance, {
      get(target, prop) {
        if (prop === "getGitErrUrl") {
          return () => {
            return remoteUrl;
          };
        }

        if (prop === "getRemoteUrl") {
          return () => {
            return remoteUrl;
          };
        }

        if (prop === "getLog") {
          return target[prop];
        }

        return target[prop];
      }
    });
  }

  async update(e = this.e) {
    if (!this.e.isMaster) return false
    e.msg = `#${e.msg.includes("强制") ? "强制" : ""}更新starlight-img`;

    const up = await this.initUpdate(e, Plugin_Name, remoteUrl);
    up.e = e;

    return up.update();
  }

  async sendLog(e = this.e) {
    if (!this.e.isMaster) return false
    const up = await this.initUpdate(e, Plugin_Name, remoteUrl);
    up.e = e;


    const logMsg = await up.getLog(Plugin_Name);

    if (!logMsg || !logMsg.data) {
      return false;
    }

    const updatedNodes = logMsg.data.map(node => ({
      ...node, 
      nickname: "星点图片", 
      user_id: Bot.uin,   
      message: node.message 
    }));

    return e.reply(await Bot.makeForwardMsg(updatedNodes));

  }
}
