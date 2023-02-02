import{_ as n,p as s,q as a,a1 as p}from"./framework-96b046e1.js";const t={},e=p(`<h1 id="git-commit-配置" tabindex="-1"><a class="header-anchor" href="#git-commit-配置" aria-hidden="true">#</a> git commit 配置</h1><p>在之前 vue2 的项目中使用 ghooks + validate-commit-msg 来对 commit message 进行校验，切换到 vue3 的时候这个不管用了，经过一番网上调查现在都在使用 husky+commitlint 来做校验，不过根据网上的教程配置了下总有这样那样的问题，还是自己查官网文档自己尝试一遍吧。</p><p>用 pnpm 作为包管理为例:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#新建项目</span>
<span class="token function">pnpm</span> create vite

<span class="token comment"># 初始化仓库</span>
<span class="token function">git</span> init

<span class="token comment"># 删除package.json里的type</span>
<span class="token comment"># type是在nodejs 13.2.0以后用来指定默认的模块规范，但是由于历史原因各种npm包中的模块化方案并不一致，所以还是采用默认commonjs规范</span>
<span class="token function">pnpm</span> pkg delete <span class="token builtin class-name">type</span>

<span class="token comment"># 新增脚本</span>
<span class="token function">pnpm</span> pkg <span class="token builtin class-name">set</span> <span class="token assign-left variable">scripts.prepare</span><span class="token operator">=</span><span class="token string">&quot;husky install &amp;&amp; husky add .husky/commit-msg <span class="token entity" title="\\&quot;">\\&quot;</span>npx --no -- commitlint --edit<span class="token entity" title="\\&quot;">\\&quot;</span>&quot;</span>
<span class="token function">pnpm</span> pkg <span class="token builtin class-name">set</span> <span class="token assign-left variable">scripts.commit</span><span class="token operator">=</span><span class="token string">&quot;cz&quot;</span>

<span class="token comment"># 需安装以下依赖</span>
<span class="token function">pnpm</span> <span class="token function">add</span> <span class="token parameter variable">-D</span> @commitlint/cli <span class="token comment"># commit message校验</span>
<span class="token function">pnpm</span> <span class="token function">add</span> <span class="token parameter variable">-D</span> @commitlint/config-conventional
<span class="token function">pnpm</span> <span class="token function">add</span> <span class="token parameter variable">-D</span> @commitlint/cz-commitlint
<span class="token function">pnpm</span> <span class="token function">add</span> <span class="token parameter variable">-D</span> chalk  <span class="token comment"># commitlint依赖</span>
<span class="token function">pnpm</span> <span class="token function">add</span> <span class="token parameter variable">-D</span> commitizen  <span class="token comment"># 交互式提交commit</span>
<span class="token function">pnpm</span> <span class="token function">add</span> <span class="token parameter variable">-D</span> husky inquirer @types/node <span class="token comment"># git hook</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>给 package.json 添加以下配置</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token property">&quot;config&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token property">&quot;commitizen&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;@commitlint/cz-commitlint&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>增加 commitlint 配置文件 commitlint.config.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// 继承的规则</span>
  <span class="token keyword">extends</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;@commitlint/config-conventional&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">prompt</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">settings</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">messages</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">skip</span><span class="token operator">:</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">max</span><span class="token operator">:</span> <span class="token string">&quot;只能输入%d个字符&quot;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">min</span><span class="token operator">:</span> <span class="token string">&quot;至少%d个字符&quot;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">emptyWarning</span><span class="token operator">:</span> <span class="token string">&quot;不能为空&quot;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">upperLimitWarning</span><span class="token operator">:</span> <span class="token string">&quot;over limit&quot;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">lowerLimitWarning</span><span class="token operator">:</span> <span class="token string">&quot;below limit&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">questions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;选择你要提交的类型&quot;</span><span class="token punctuation">,</span>
        <span class="token keyword">enum</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">feat</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;新增功能&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;feat&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;✨&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token literal-property property">fix</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;修复 bug&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;fix&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;🐛&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token literal-property property">docs</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;文档变更&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;docs&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;📚&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token literal-property property">style</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;代码格式（不影响功能，例如空格、分号等格式修正）&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;style&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;💎&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token literal-property property">ci</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span>
              <span class="token string">&quot;更改CI配置文件和脚本（示例范围：Travis、Circle、BrowserStack、SauceLabs）&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;ci&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;⚙️&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token literal-property property">build</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span>
              <span class="token string">&quot;构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;build&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;🛠&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token literal-property property">refactor</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;代码重构（不包括 bug 修复、功能新增）&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;refactor&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;📦&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token literal-property property">perf</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;性能优化&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;perf&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;🚀&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;添加、修改测试用例&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;🚨&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token literal-property property">chore</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span>
              <span class="token string">&quot;对构建过程或辅助工具和库的更改（不影响源文件、测试用例）&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;chore&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;♻️&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token literal-property property">revert</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;回滚&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;revert&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">emoji</span><span class="token operator">:</span> <span class="token string">&quot;🗑&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">scope</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;输入一个 scope（可选）&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">subject</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;填写简短精炼的变更描述&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">body</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;填写更加详细的变更描述（可选）&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">isBreaking</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;是否有突破性的变化？&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">breakingBody</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;破坏性更改提交需要一个正文。请输入提交本身的更长描述&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">breaking</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;描述突破性的变化&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">isIssueAffected</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&quot;此更改是否会影响任何未解决的issues?&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">issuesBody</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">description</span><span class="token operator">:</span>
          <span class="token string">&quot;If issues are closed, the commit requires a body. Please enter a longer description of the commit itself&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">issues</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&#39;Add issue references (e.g. &quot;fix #123&quot;, &quot;re #123&quot;.)&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行提交的时候可以通过 vscode 版本管理直接输入 commit message 进行提交，commitlint 会在点击提交后校验 commit message。另外也可以通过命令行的方式提交代码。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">pnpm</span> commit

cz-cli@4.2.6, @commitlint/cz-commitlint@17.4.0

? 选择你要提交的类型: <span class="token punctuation">(</span>Use arrow keys<span class="token punctuation">)</span>
<span class="token operator">&gt;</span> feat:       新增功能
  fix:        修复 bug
  docs:       文档变更
  style:      代码格式（不影响功能，例如空格、分号等格式修正）
  refactor:   代码重构（不包括 bug 修复、功能新增）
  perf:       性能优化
  test:       添加、修改测试用例
? 输入一个 scope（可选）: 只能输入96个字符
 <span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span> <span class="token comment"># 如果不清楚scope建议为空</span>
? 填写简短精炼的变更描述: 只能输入96个字符
 <span class="token punctuation">(</span><span class="token number">15</span><span class="token punctuation">)</span> <span class="token function">add</span> new feature <span class="token comment"># commmit message</span>
? 填写更加详细的变更描述（可选）:

? 是否有突破性的变化？: No
? 此更改是否会影响任何未解决的issues?: No

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),o=[e];function i(l,r){return s(),a("div",null,o)}const u=n(t,[["render",i],["__file","git-commit-config.html.vue"]]);export{u as default};
