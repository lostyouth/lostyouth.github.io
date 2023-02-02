import { defineUserConfig, defaultTheme } from "vuepress";

export default defineUserConfig({
  lang: "zh-CN",
  title: "lostyouth",
  description: "this is Dylan's blog",
  theme: defaultTheme({
    navbar: [
      {
        text: "开发",
        link: "/dev/frp",
      },
      {
        text: "Cocos",
        link: "/cocos/get-start",
      },
      {
        text: "Webgl",
        link: "/webgl/get-start",
      },
    ],
    sidebar: {
      "/dev/": [
        {
          text: "开发",
          children: ["/dev/frp.md", "/dev/git-commit-config.md"],
        },
      ],
      "/cocos/": [
        {
          text: "cocos",
          children: ["/dev/get-start.md"],
        },
      ],
      "/webgl/": [
        {
          text: "webgl",
          children: ["/webgl/get-start.md"],
        },
      ],
    },
  }),
});
