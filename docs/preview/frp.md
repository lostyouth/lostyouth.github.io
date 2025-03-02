---
title: frp内网穿透
tags:
  - Linux
createTime: 2022/03/016 13:14:14
permalink: /article/jw8aizl2/
---

最近在做一个项目，需要将本地服务暴露到公网，于是找到了[frp](https://github.com/fatedier/frp)这个工具，这里记录一下使用过程。

frp的原理是通过在本地（客户端）和远程服务器（服务端）之间建立一个隧道，将本地服务暴露到公网。

## 单域名配置步骤

### 1.新增一个二级域名

在域名管理后台新增一个二级域名，例如：`test.example.com`。

### 2.安装frp客户端

在本地服务器上安装frp客户端，下载地址：https://github.com/fatedier/frp/releases，下载解压后配置`frpc.ini`:

```ini
[common]                       # 服务器配置
server_addr = 39.xx.xx.xx      # 公网ip
server_port = 7000             # 端口，如果是阿里云CES需要在安全组开启端口
auth.token = "xxxxxxxxxxxxxxx" # 与frps服务端配置一致

[web]                       # 网站配置
type = http                 # http协议
local_port = 5188           # 本地服务端口
custom_domains = localhost  # localhost为服务端nginx代理二级域名的地址，避免暴露多余端口
```

### 3.配置frps.service

在远程服务器上新建`frps.service`文件，内容如下：

```bash
sudo vim /etc/systemd/system/frps.service
```

```ini
[Unit]
# 服务名称，可自定义
Description = frp server
After = network.target syslog.target
Wants = network.target

[Service]
Type = simple
# 启动frps的命令，需修改为您的frps的安装路径
ExecStart = /path/to/frps -c /path/to/frps.toml

[Install]
WantedBy = multi-user.target
```

使用 systemd 命令管理 frps 服务

```bash
# 开机自启动
sudo systemctl enable frps
# 启动frp
sudo systemctl start frps
# 停止frp
sudo systemctl stop frps
# 重启frp
sudo systemctl restart frps
# 查看frp状态
sudo systemctl status frps
```

### 4.在远程服务器上安装frp服务端

在远程服务器上安装frp服务端，下载地址：https://github.com/fatedier/frp/releases，下载解压后配置`frps.ini`:

```ini
[common]
bind_port = 7000            # 此端口为客户端访问服务端的端口
vhost_http_port = 7000      # 此端口为域名访问服务端的端口
auth.token = "xxxxxxxxxxxxxxx"
```

### 5.配置nginx

在远程服务器上配置nginx，将`test.example.com`的请求转发到`localhost:5188`，配置如下：

```nginx
server {
    listen       80;    
    server_name  test.example.com;

    location / {
        proxy_pass http://localhost:7000; # vhost_http_port
    }

    error_page   500 502 503 504  /50x.html;

    location = /50x.html {
        root   html;
    }
}
```

## 实际使用中采用的多个子域名的配置

### 1.frps服务端

```ini
[common]
bind_port = 7000
vhost_http_port = 7000
subdomain_host = example.com
auth.token = "xxxxxxxxxxxxxxx"
```

### 2.frpc客户端

```ini
[common]
server_addr = 39.xx.xx.xx
server_port = 7000
auth.token = "xxxxxxxxxxxxxxx" # 与frps服务端配置一致

[web_a]
type = http
local_port = 8080 // 本地服务端口
subdomain = a

[web_b]
type = http
local_port = 8081 // 本地服务端口
subdomain = b
```

### 3.nginx配置

```nginx
server {
    listen       80;    
    server_name  a.example.com;

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

server {
    listen       80;    
    server_name  b.example.com;

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

## 常见问题

1. frpc客户端在linux自启动失败，失败后重新再次启动

```ini
# 修改部分
[Service]
Type = simple
User = nobody
Restart = on-failure
RestartSec = 5s
ExecStart = frpc -c frpc.ini
ExecReload = frpc reload -c frpc.ini
```