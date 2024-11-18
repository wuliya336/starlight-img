import { Config, Common, Data } from "../components/index.js";
import repoCheck from "../model/repoCheck.js";

export class MonitorTask extends plugin {
  constructor() {
    super({
      name: "星点图片:监控github仓库状态",
      event: "message",
      priority: -20,
      rule: [
        {
          reg: /^#?(星点图片|starlight-img)?检测(仓库|github)更新(推送)?$/i,
          fnc: "Monitor",
        },
      ],
    });

    if (Config.other.GithubPush) {
      this.task = {
        name: "星点签名:仓库更新检测",
        cron: "0 0/5 * * * ?",
        log: false,
        fnc: () => {
          this.MonitorTask(true);
        },
      };
    }
  }

  async Monitor(e) {
    await this.MonitorTask(false, e);
  }

  async MonitorTask(Auto = false, e = null) {
    if (!Auto) {
      await this.SelectMonitor(e);
      return true;
    }

    if (await redis.get(`starlight-qsign:Github:PushStatus`)) {
      return true;
    } else {
      await redis.set(
        `starlight-qsign:Github:PushStatus`,
        JSON.stringify({ PushStatus: 1 }),
      );
      await redis.expire(`starlight-qsign:Github:PushStatus`, 60 * 5 - 5);
    }

    try {
      const commitInfo = await repoCheck(false);

      if (commitInfo) {
        const image = await Common.render(
          "repoPush/index",
          { commitInfo },
          { e, scale: 1.4 },
        );

        const firstMasterQQ = Config.masterQQ[0];
        if (!isNaN(firstMasterQQ) && firstMasterQQ.toString().length <= 11) {
          await Bot.pickFriend(firstMasterQQ).sendMsg(image);
        }
      }
    } catch (error) {
      logger.error("仓库更新检测出错:", error);
      return true;
    }

    return true;
  }

  async SelectMonitor(e) {
    try {
      const commitInfo = await repoCheck(true);

      const image = await Common.render(
        "repoPush/index",
        { commitInfo },
        { e, scale: 1.4 },
      );

      await e.reply(image);
    } catch (error) {
      logger.error("手动检测出错:", error);
      await e.reply("检测仓库更新出错,请稍后再试");
    }

    return true;
  }
}
