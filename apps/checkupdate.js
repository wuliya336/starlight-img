/* 该文件借鉴并CvanSky_Qs */

import fs from 'fs'
import path from 'path'
import cfg from '../../../lib/config/config.js'
import axios from "axios";

let Group= 837947839
let cwd = process.cwd().replace(/\\/g, "/")
let GithubStatic = `${cwd}/plugins/starlight-img/resources/Github/GithubStatic.json`

export class MonitorTask extends plugin {
    constructor() {
        super({
            name: '星点图片:监控github仓库状态',
            event: 'message',
            priority: -20,
            rule: [
                {
                    reg: /^#?(星点图片)?检测(仓库|github|(星点图片|starlight-img))更新$/i,
                    fnc: 'Monitor'
                }
            ]
        })
        this.task = {
            name: '星点图片:仓库更新检测',
            cron: '0 0/4 * * * ? ',
            fnc: () => {
                this.MonitorTask(true)
            }
        }
    }

    async Monitor(e) {
        await this.MonitorTask(false, e)
    }

    async MonitorTask(Auto = false, e = null) {
        if (Auto === false) {
            await this.SelectMonitor(e)
            return true
        }
        let OpenStatus = JSON.parse(await redis.get(`starlight-img:FunctionOFF`));
        if (OpenStatus.GitHubPush !== 1) return true
        if (await redis.get(`starlight-img:Github:PushStatus`)) {
            return true
        } else {
            await redis.set(`starlight-img:Github:PushStatus`, JSON.stringify({PushStatus: 1}));
            await redis.expire(`starlight-img:Github:PushStatus`, 60 * 4 - 5);
        }
        const dirPath = path.dirname(GithubStatic);
        fs.mkdirSync(dirPath, {recursive: true});
        if (!fs.existsSync(GithubStatic)) fs.writeFileSync(GithubStatic, '{}');
        let GithubStaticJson = JSON.parse(fs.readFileSync(GithubStatic))
        try {
            const res = await axios.get('https://api.github.com/repos/wuliya336/starlight-img/commits')
            const data = res.data
            if (!data[0]) return
            let Json = data[0]
            if (GithubStaticJson.sha !== Json.sha) {
                GithubStaticJson = Json
                fs.writeFileSync(GithubStatic, JSON.stringify(GithubStaticJson))
                logger.info(logger.magenta('>>>已更新GithubStatic.json'))
                let UTC_Date = Json.commit.committer.date
                const cnTime = new Date(UTC_Date).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false})
                let MsgList = [`[星点图片]更新自动推送\nContributors：${Json.commit.committer.name}\nDate:${cnTime}\nMessage:${Json.commit.message}\nUrl:${Json.html_url}`]
                let acgList = []
                    let bot = {nickname: "星点图片", user_id: Bot.uin}
                    acgList.push(
                        {
                            message: MsgList,
                            ...bot,
                        },
                    )
                    let ForMsg= await Bot.makeForwardMsg(acgList)
                try{
                    ForMsg.data=ForMsg.data
                        .replace(/\n/g, '')
                        .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
                        .replace(/___+/, '<title color="#777777" size="26">星点图片更新</title>')
                }catch (err){}
                let MainGroup=Array.from(Bot.getGroupList().keys()).includes(Group)
                if (MainGroup) {
                    await Bot.pickGroup(Number(Group)).sendMsg(ForMsg)
                }
                let list = cfg.masterQQ
                if (Json.commit.message.includes("[不推送]") || !Json.commit.message) {
                    logger.info(logger.magenta('[星点图片]>>>检测到[不推送]标签，已跳过本次推送'))
                    return true
                }
                let MasterNum = list.length
                // 推送策略：只推一个人,从第一个人开始，但是如果第一个人的QQ号长度大于11，说明是频道号，那就推第二个人，以此类推，当成功推送一次后，就不再推送
                for (let i = 0; i < MasterNum; i++) {
                    if ((list[i].toString()).length <= 11) {
                        logger.info(logger.magenta(`Master:${list[i]}`))
                        try {
                            // 推送消息给当前主人
                            await Bot.pickFriend(Number(list[i])).sendMsg(ForMsg)
                            break // 推送成功后跳出循环
                        } catch (err) {
                            logger.info(`QQ号${list[i]}推送失败，向下推送`)
                        }
                    }
                }
            }
        } catch (error) {
            return true
        }
        return true
    }

    async SelectMonitor(e) {
        const res = await axios.get('https://api.github.com/repos/wuliya336/starlight-img/commits')
        const data = res.data
        if (!data[0]) return
        let Json = data[0]
        logger.info(logger.magenta('>>>手动检测星点图片仓库最新代码'))
        let UTC_Date = Json.commit.committer.date
        const cnTime = new Date(UTC_Date).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false})
        await e.reply(`[星点图片最近更新]\nContributors：${Json.commit.committer.name}\nDate:${cnTime}\nMessage:${Json.commit.message}\nUrl:${Json.html_url}`)
        return true
    }
}