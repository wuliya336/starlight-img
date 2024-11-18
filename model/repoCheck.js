import axios from "axios";
import { Data } from "../components/index.js";

async function repoCheck(manual = false) {
  const dirPath = "resources/Github";
  const jsonFile = `${dirPath}/GithubStatic.json`;

  try {
    Data.createDir(dirPath);

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
      return manual ? Data.readJSON(jsonFile) : null;
    }

    const commitInfo = {
      author: authorName,
      committer: committerName,
      avatar: authorAvatar || "{{_res_path}}/repoPush/icons/author.svg",
      date: new Date(commit.commit.committer.date).toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        hour12: false,
      }),
      message: commitMessage.split("\n")[0],
    };

    const existingData = Data.readJSON("GithubStatic.json", dirPath);

    if (!existingData || existingData.message !== commitInfo.message) {
      Data.writeJSON(jsonFile, commitInfo, "\t");
      return commitInfo;
    }

    return manual ? existingData : null;
  } catch (error) {
    logger.error("获取最新提交出错:", error);
  }
}

export default repoCheck;
