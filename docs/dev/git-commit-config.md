---
lang: zh-CN
title: git commit 配置
description: git commit 配置
---

# git commit 配置

在之前 vue2 的项目中使用 ghooks + validate-commit-msg 来对 commit message 进行校验，切换到 vue3 的时候这个不管用了，经过一番网上调查现在都在使用 husky+commitlint 来做校验，不过根据网上的教程配置了下总有这样那样的问题，还是自己查官网文档自己尝试一遍吧。

用 pnpm 作为包管理为例:

```bash
#新建项目
pnpm create vite

# 初始化仓库
git init

# 删除package.json里的type
# type是在nodejs 13.2.0以后用来指定默认的模块规范，但是由于历史原因各种npm包中的模块化方案并不一致，所以还是采用默认commonjs规范
pnpm pkg delete type

# 新增脚本
pnpm pkg set scripts.prepare="husky install && husky add .husky/commit-msg \"npx --no -- commitlint --edit\""
pnpm pkg set scripts.commit="cz"

# 需安装以下依赖
pnpm add -D @commitlint/cli # commit message校验
pnpm add -D @commitlint/config-conventional
pnpm add -D @commitlint/cz-commitlint
pnpm add -D chalk  # commitlint依赖
pnpm add -D commitizen  # 交互式提交commit
pnpm add -D husky inquirer @types/node # git hook
```

给 package.json 添加以下配置

```json
"config": {
  "commitizen": {
    "path": "@commitlint/cz-commitlint"
  }
}
```

增加 commitlint 配置文件 commitlint.config.js

```js
module.exports = {
  // 继承的规则
  extends: ["@commitlint/config-conventional"],
  prompt: {
    settings: {},
    messages: {
      skip: "",
      max: "只能输入%d个字符",
      min: "至少%d个字符",
      emptyWarning: "不能为空",
      upperLimitWarning: "over limit",
      lowerLimitWarning: "below limit",
    },
    questions: {
      type: {
        description: "选择你要提交的类型",
        enum: {
          feat: {
            description: "新增功能",
            title: "feat",
            emoji: "✨",
          },
          fix: {
            description: "修复 bug",
            title: "fix",
            emoji: "🐛",
          },
          docs: {
            description: "文档变更",
            title: "docs",
            emoji: "📚",
          },
          style: {
            description: "代码格式（不影响功能，例如空格、分号等格式修正）",
            title: "style",
            emoji: "💎",
          },
          ci: {
            description:
              "更改CI配置文件和脚本（示例范围：Travis、Circle、BrowserStack、SauceLabs）",
            title: "ci",
            emoji: "⚙️",
          },
          build: {
            description:
              "构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）",
            title: "build",
            emoji: "🛠",
          },
          refactor: {
            description: "代码重构（不包括 bug 修复、功能新增）",
            title: "refactor",
            emoji: "📦",
          },
          perf: {
            description: "性能优化",
            title: "perf",
            emoji: "🚀",
          },
          test: {
            description: "添加、修改测试用例",
            title: "test",
            emoji: "🚨",
          },
          chore: {
            description:
              "对构建过程或辅助工具和库的更改（不影响源文件、测试用例）",
            title: "chore",
            emoji: "♻️",
          },
          revert: {
            description: "回滚",
            title: "revert",
            emoji: "🗑",
          },
        },
      },
      scope: {
        description: "输入一个 scope（可选）",
      },
      subject: {
        description: "填写简短精炼的变更描述",
      },
      body: {
        description: "填写更加详细的变更描述（可选）",
      },
      isBreaking: {
        description: "是否有突破性的变化？",
      },
      breakingBody: {
        description: "破坏性更改提交需要一个正文。请输入提交本身的更长描述",
      },
      breaking: {
        description: "描述突破性的变化",
      },
      isIssueAffected: {
        description: "此更改是否会影响任何未解决的issues?",
      },
      issuesBody: {
        description:
          "If issues are closed, the commit requires a body. Please enter a longer description of the commit itself",
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)',
      },
    },
  },
};
```

执行提交的时候可以通过 vscode 版本管理直接输入 commit message 进行提交，commitlint 会在点击提交后校验 commit message。另外也可以通过命令行的方式提交代码。

```bash
pnpm commit

cz-cli@4.2.6, @commitlint/cz-commitlint@17.4.0

? 选择你要提交的类型: (Use arrow keys)
> feat:       新增功能
  fix:        修复 bug
  docs:       文档变更
  style:      代码格式（不影响功能，例如空格、分号等格式修正）
  refactor:   代码重构（不包括 bug 修复、功能新增）
  perf:       性能优化
  test:       添加、修改测试用例
? 输入一个 scope（可选）: 只能输入96个字符
 (0) # 如果不清楚scope建议为空
? 填写简短精炼的变更描述: 只能输入96个字符
 (15) add new feature # commmit message
? 填写更加详细的变更描述（可选）:

? 是否有突破性的变化？: No
? 此更改是否会影响任何未解决的issues?: No

```
