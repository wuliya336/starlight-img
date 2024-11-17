import axios from "axios";
import { Data } from "../components/index.js";

async function repoCheck(filePath, pluginPath) {
  try {
    const res = await axios.get(
      "https://api.github.com/repos/wuliya336/starlight-img/commits",
    );
    const commit = res.data[0];

    const { name: committerName, email: committerEmail } =
      commit.commit.committer;
    const { name: authorName, avatar_url: authorAvatar } = commit.author || {};
    const commitMessage = commit.commit.message;

    if (
      committerName.includes("GitHub Action") ||
      committerEmail === "actions@github.com"
    ) {
      return;
    }

    const commitInfo = {
      author: authorName,
      committer: committerName,
      avatar: authorAvatar || "{{_res_path}}/repoPush/icons/author.svg", // 设置默认头像路径
      date: new Date(commit.commit.committer.date).toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        hour12: false,
      }),
      message: commitMessage.split("\n")[0],
    };

    Data.writeJSON(filePath, commitInfo, "\t", pluginPath);
  } catch (error) {
    console.error("获取最新提交出错:", error);
  }
}

export default repoCheck;
