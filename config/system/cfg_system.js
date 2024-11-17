export const cfgSchema = {
  img: {
    title: "图片设置",
    cfg: {
      img: {
        title: "随机图片",
        key: "随机图片",
        def: true,
        desc: "是否开启随机图片",
        fileName: "img",
      },
      poke: {
        title: "戳一戳图片",
        key: "戳一戳图片",
        def: true,
        desc: "是否开启戳一戳图片",
        fileName: "img",
      },
    },
  },
  other: {
    title: "其他设置",
    cfg: {
      GithubPush: {
        title: "仓库更新检测推送",
        key: "仓库更新检测推送",
        def: false,
        desc: "是否开启仓库更新检测推送，开启后将定时检测仓库更新并推送",
        fileName: "other",
      },
      renderScale: {
        title: "渲染精度",
        key: "渲染精度",
        type: "num",
        def: 100,
        input: (n) => Math.min(200, Math.max(50, n * 1 || 100)),
        desc: "可选值50~200，建议100。设置高精度会提高图片的精细度，但因图片较大可能会影响渲染与发送速度",
        fileName: "other",
      },
    },
  },
};
