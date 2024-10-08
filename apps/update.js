import { update as Update } from "../../other/update.js";
import { Plugin_Name } from "../components/index.js"; 

const customRemoteUrl = "https://github.com/wuliya336/starlight-img";

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
  
  async initUpdate(e, Plugin_Name, customRemoteUrl) {
    const updateInstance = new Update(e);  

    return new Proxy(updateInstance, {
      get(target, prop) {
        if (prop === "getRemoteUrl") {
          return () => {
            console.log(`getRemoteUrl called, returning custom URL: ${customRemoteUrl}`);
            return customRemoteUrl;
          };
        }

        if (prop === "getLog") {
          return async (...args) => {
            console.log(`Proxy intercepted getLog for plugin: ${Plugin_Name}`);

            const log = await target.getLog(...args);
            if (log && log.data) {
              log.data = log.data.map(node => ({
                ...node,
                nickname: "星点图片",  
                user_id: Bot.uin,     
              }));
            }

            return log; 
          };
        }

        return target[prop];  
      }
    });
  }

  async update(e = this.e) {
    if (!this.e.isMaster) return false; 
    e.msg = `#${e.msg.includes("强制") ? "强制" : ""}更新starlight-img`; 

    const up = await this.initUpdate(e, Plugin_Name, customRemoteUrl); 
    up.e = e; 

    return up.update();
  }

  async sendLog(e = this.e) {
    if (!this.e.isMaster) return false;  

    const up = await this.initUpdate(e, Plugin_Name, customRemoteUrl);  
    up.e = e; 

    const logMsg = await up.getLog(Plugin_Name);  

    if (!logMsg || !logMsg.data) {
      return false;
    }

    const updatedNodes = logMsg.data.map(node => ({
      ...node,
      message: node.message 
    }));

    return e.reply(await Bot.makeForwardMsg(updatedNodes));
  }
}
