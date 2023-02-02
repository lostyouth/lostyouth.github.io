---
lang: zh-CN
title: frp配置
description: frp配置
---

# frp 配置

内网穿透工具是[这个](https://github.com/fatedier/frp)官方文档地址[在这](https://gofrp.org/docs/)。

frp 的大概原理是通过在本地局域网内的服务器配置的 frpc（客户端）连接在具有公网 ip 的服务器上配置的 frps（服务端）实现内网穿透功能。

不同于官网使用域名加端口的例子，本文要实现的通过配置二级域名实现内网穿透。

## 单域名配置

1. 新增一个二级域名
2. 安装 frp 客户端

下载最新版本的[frp](https://github.com/fatedier/frp/releases)解压到本地目录，配置 frpc.ini 如下

```ini
[common]                  # 服务器配置
server_addr = 39.xx.xx.xx # 公网ip
server_port = 7000        # 端口，如果是阿里云CES需要在安全组开启端口

[web]                       # 网站配置
type = http                 # http协议
local_port = 5188           # 本地服务端口
custom_domains = localhost  # localhost为服务端nginx代理二级域名的地址，避免暴露多余端口
```

3. 安装 frp 服务端

下载最新版本的[frp](https://github.com/fatedier/frp/releases)解压到本地目录，[参考官网](https://gofrp.org/docs/setup/systemd/)文档配置系统服务，配置 frps.ini 如下

```ini
[common]
bind_port = 7000            # 此端口为客户端访问服务端的端口
vhost_http_port = 7000      # 此端口为域名访问服务端的端口
```

4. 配置 nginx

新建 frp.conf 配置如下

```nginx
server {
    listen       80;
    server_name  frp.xxxxx.com;

    location / {
        proxy_pass http://localhost:7000; # vhost_http_port
    }

    error_page   500 502 503 504  /50x.html;

    location = /50x.html {
        root   html;
    }
}
```

## 多个子域名配置步骤

1. frps 服务端

```ini
[common]
bind_port = 7000
vhost_http_port = 7000
subdomain_host = xxxxx.com
```

2. nginx a.conf 配置

```nginx
server {
    listen       80;
    server_name  a.xxxxx.com;

    location / {
        proxy_pass http://localhost:7000;
        // 必须在header里设置host
	    proxy_set_header Host $host;
    }

    error_page   500 502 503 504  /50x.html;

    location = /50x.html {
        root   html;
    }
}
```

3. frpc 客户端

```ini
[common]
server_addr = 39.xx.xx.xx
server_port = 7000

[web_a]
type = http
local_port = 8080 // 本地服务端口
subdomain = a

[web_b]
type = http
local_port = 8081 // 本地服务端口
subdomain = b
```
