import{_ as p,M as l,p as i,q as o,R as n,t as s,N as e,a1 as t}from"./framework-96b046e1.js";const c={},r=n("h1",{id:"frp-配置",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#frp-配置","aria-hidden":"true"},"#"),s(" frp 配置")],-1),u={href:"https://github.com/fatedier/frp",target:"_blank",rel:"noopener noreferrer"},d={href:"https://gofrp.org/docs/",target:"_blank",rel:"noopener noreferrer"},v=n("p",null,"frp 的大概原理是通过在本地局域网内的服务器配置的 frpc（客户端）连接在具有公网 ip 的服务器上配置的 frps（服务端）实现内网穿透功能。",-1),k=n("p",null,"不同于官网使用域名加端口的例子，本文要实现的通过配置二级域名实现内网穿透。",-1),m=n("h2",{id:"单域名配置",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#单域名配置","aria-hidden":"true"},"#"),s(" 单域名配置")],-1),b=n("ol",null,[n("li",null,"新增一个二级域名"),n("li",null,"安装 frp 客户端")],-1),h={href:"https://github.com/fatedier/frp/releases",target:"_blank",rel:"noopener noreferrer"},_=t(`<div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">common</span><span class="token punctuation">]</span></span>                  # 服务器配置
<span class="token key attr-name">server_addr</span> <span class="token punctuation">=</span> <span class="token value attr-value">39.xx.xx.xx # 公网ip</span>
<span class="token key attr-name">server_port</span> <span class="token punctuation">=</span> <span class="token value attr-value">7000        # 端口，如果是阿里云CES需要在安全组开启端口</span>

<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">web</span><span class="token punctuation">]</span></span>                       # 网站配置
<span class="token key attr-name">type</span> <span class="token punctuation">=</span> <span class="token value attr-value">http                 # http协议</span>
<span class="token key attr-name">local_port</span> <span class="token punctuation">=</span> <span class="token value attr-value">5188           # 本地服务端口</span>
<span class="token key attr-name">custom_domains</span> <span class="token punctuation">=</span> <span class="token value attr-value">localhost  # localhost为服务端nginx代理二级域名的地址，避免暴露多余端口</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>安装 frp 服务端</li></ol>`,2),x={href:"https://github.com/fatedier/frp/releases",target:"_blank",rel:"noopener noreferrer"},f={href:"https://gofrp.org/docs/setup/systemd/",target:"_blank",rel:"noopener noreferrer"},g=t(`<div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">common</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">bind_port</span> <span class="token punctuation">=</span> <span class="token value attr-value">7000            # 此端口为客户端访问服务端的端口</span>
<span class="token key attr-name">vhost_http_port</span> <span class="token punctuation">=</span> <span class="token value attr-value">7000      # 此端口为域名访问服务端的端口</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>配置 nginx</li></ol><p>新建 frp.conf 配置如下</p><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">listen</span>       <span class="token number">80</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server_name</span>  frp.xxxxx.com</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">proxy_pass</span> http://localhost:7000</span><span class="token punctuation">;</span> <span class="token comment"># vhost_http_port</span>
    <span class="token punctuation">}</span>

    <span class="token directive"><span class="token keyword">error_page</span>   <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span>  /50x.html</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">location</span> = /50x.html</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">root</span>   html</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="多个子域名配置步骤" tabindex="-1"><a class="header-anchor" href="#多个子域名配置步骤" aria-hidden="true">#</a> 多个子域名配置步骤</h2><ol><li>frps 服务端</li></ol><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">common</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">bind_port</span> <span class="token punctuation">=</span> <span class="token value attr-value">7000</span>
<span class="token key attr-name">vhost_http_port</span> <span class="token punctuation">=</span> <span class="token value attr-value">7000</span>
<span class="token key attr-name">subdomain_host</span> <span class="token punctuation">=</span> <span class="token value attr-value">xxxxx.com</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>nginx a.conf 配置</li></ol><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">listen</span>       <span class="token number">80</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server_name</span>  a.xxxxx.com</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">proxy_pass</span> http://localhost:7000</span><span class="token punctuation">;</span>
        // 必须在header里设置host
	    <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token directive"><span class="token keyword">error_page</span>   <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span>  /50x.html</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">location</span> = /50x.html</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">root</span>   html</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>frpc 客户端</li></ol><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">common</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">server_addr</span> <span class="token punctuation">=</span> <span class="token value attr-value">39.xx.xx.xx</span>
<span class="token key attr-name">server_port</span> <span class="token punctuation">=</span> <span class="token value attr-value">7000</span>

<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">web_a</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">type</span> <span class="token punctuation">=</span> <span class="token value attr-value">http</span>
<span class="token key attr-name">local_port</span> <span class="token punctuation">=</span> <span class="token value attr-value">8080 // 本地服务端口</span>
<span class="token key attr-name">subdomain</span> <span class="token punctuation">=</span> <span class="token value attr-value">a</span>

<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">web_b</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">type</span> <span class="token punctuation">=</span> <span class="token value attr-value">http</span>
<span class="token key attr-name">local_port</span> <span class="token punctuation">=</span> <span class="token value attr-value">8081 // 本地服务端口</span>
<span class="token key attr-name">subdomain</span> <span class="token punctuation">=</span> <span class="token value attr-value">b</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11);function y(w,N){const a=l("ExternalLinkIcon");return i(),o("div",null,[r,n("p",null,[s("内网穿透工具是"),n("a",u,[s("这个"),e(a)]),s("官方文档地址"),n("a",d,[s("在这"),e(a)]),s("。")]),v,k,m,b,n("p",null,[s("下载最新版本的"),n("a",h,[s("frp"),e(a)]),s("解压到本地目录，配置 frpc.ini 如下")]),_,n("p",null,[s("下载最新版本的"),n("a",x,[s("frp"),e(a)]),s("解压到本地目录，"),n("a",f,[s("参考官网"),e(a)]),s("文档配置系统服务，配置 frps.ini 如下")]),g])}const V=p(c,[["render",y],["__file","frp.html.vue"]]);export{V as default};
