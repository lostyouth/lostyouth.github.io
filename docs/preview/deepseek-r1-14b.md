---
title: deepseek-r1-14B的安装和应用
tags: 
  - 大模型
createTime: 2025/02/21 19:16:56
permalink: /article/0zjalw9f/
---

## 安装Ollama

Ollama 是一个基于 Go 语言开发的本地大语言模型运行框架，类似于 Docker 的操作方式，支持多种预训练模型（如 DeepSeek、LLaMA 2、Mistral 等），并提供便捷的本地实验和 AI 应用开发环境。

### Ollama 的主要功能

1. 本地模型管理：支持从官方模型库或自定义模型库拉取预训练模型，并在本地保存和加载
2. 高效推理：通过 GPU/CPU 加速，提供高效的模型推理能力
3. 多种接口访问：支持命令行（CLI）、HTTP 接口访问推理服务，并通过 OpenAI 客户端实现更广泛的集成
4. 模型微调与自定义：用户可以基于预训练模型进行微调，满足特定需求
5. 跨平台支持：支持 macOS、Linux 和 Windows 等主流操作系统

### Ollama 的特点

1. 简化部署：简化了在本地计算机上运行和部署大型语言模型的流程
2. 轻量级与可扩展：保持较小的资源占用，同时具备良好的可扩展性
3. API 支持：提供简洁的 API，方便开发者创建、运行和管理模型实例
4. 预构建模型库：包含一系列预先训练好的模型，用户可以直接选用
5. 数据隐私：支持本地运行，无需依赖云端，确保数据隐私


### Ollama 的安装与使用

使用一键安装脚本
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```
实际过程中由于脚本是去github下载安装包，由于网速原因改为手动下载了安装包，并把安装脚本修改为安装本地安装包。

### 模型的选择

下载并运行模型，运行多大的模型取决于显卡显存的大小，一般预估模型占用显存的大小可以根据模型的体积判断，本地服务器显卡为A4500 20G显存，所以选择了14B的模型。

由于deepseek-r1模型6710亿的参数，需要400+的显存空间才能运行，难以在本地服务器运行。14B的模型其实不是deepseek本模型，而是使用蒸馏技术把deepseek-r1的能力蒸馏到千问14B的模型上。14B的模型也是经过4比特量化过的。

![ollama-deepseek-r1](https://blog-1306791249.cos.ap-guangzhou.myqcloud.com/ollama-deepseek-r1-option.png)

```bash
ollama run deepseek-r1:14b
```

模型下载到最后可能会遇到下载速度变慢的情况，可以按ctrl+c暂停下载，暂停后下载进度是保留的，然后执行命令重新下载，此时下载速度会变快。

执行Ollama run以后就可以在命令框中直接和大模型对话了。Ollama也提供了server命令，可以提供本地api服务供其他应用调用。

```bash
ollama server
```

Ollama运行服务后，可以安装webui去访问api。本次选择https://github.com/ollama-webui/ollama-webui-lite 作为webui。ollama-webui-lite采用sevlte框架开发。部署完可通过http://ollama-webui.example.com/ 访问。

需要注意的是，由于Ollama server服务似乎对api/chat接口有特殊限制所以nginx的配置需要调整，特别是以下几行：

```bash
proxy_buffering off;
proxy_set_header Origin '';
proxy_set_header Referer '';
```

另外由于Ollama对接口调用并不会进行鉴权操作，应该对不必要的接口禁止访问，只允许api/chat等接口的访问。还要对api/chat接口进行限流，防止接口被恶意调用。

完整配置如下：

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

# 定义限流区域
limit_req_zone $binary_remote_addr zone=api_limit:1m rate=1r/s;

server {
    server_name ollama-webui.example.com;

    client_max_body_size 10M;
    fastcgi_buffers 8 4K;
    fastcgi_buffer_size 4K;
    client_body_buffer_size 1024k;
    root /home1/ollama/webui;
    index index.html;


    location / {
        try_files $uri $uri/ /index.html;
        index index.html;
        if ($request_filename ~* .*\.html$) {
            add_header Cache-Control "no-store";
        }
    }

    location ~* /api/(tags|version|chat|generate) {
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Origin '';
        proxy_set_header Referer '';
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS;
            add_header Access-Control-Allow-Headers X-Requested-With,Content-Type,Authorization;
            return 204;
        }
        if ($request_method != 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS;
            add_header Access-Control-Allow-Headers X-Requested-With,Content-Type,Authorization;
            proxy_pass http://127.0.0.1:11434;
        }
        # 应用限流规则
        limit_req zone=api_limit burst=2 nodelay;
    }

    location /api/ {
        return 404;
    }

    location @router {
        rewrite ^.*$ /index.html last;
    }

    error_page 500 502 503 504 /50x.html;

    location = /50x.html {
        root html;
    }
}
```

## 使用

为了探索模型在系统中的使用，尝试使用deepseek结构化输出的提示词，使用自然语言匹配预先配置好的指令，来快速操作系统。

生成指令列表以及其他规则的提示词。

```text
你现在是一个系统助手，以下是定义好的的指令，定义好的指令格式为“指令名称: 指令解释”


GEN_DAY_REPORT: 生成日报表
GEN_MONTH_REPROT: 生成月报表
GEN_YEAR_REPORT: 生成年报表
SUMMARY_EMPLOYEE_LIST: 查询员工列表
SUMMARY_EMPLOYEE_DETAIL: 查询员工详情
SUMMARY_DEPT: 查询部门

可能涉及到的查询条件对应的英文:

开始时间: startDate
结束时间: endDate
部门: deptName
时间: date
员工名称: employeeName

如果参数涉及到了时间，时间的格式参考:2025-02-07 14:38:01

需要根据用户的输入匹配系统提前定义好的指令，不要思考过程，只返回如下的结构

{
  "task": <指令名称>,
  "desc": <指令解释>,
  "params": <查询条件>
}

如果没有匹配到任何指令，不要思考过程，只返回

{
  "task": "NOT_FOUND",
  "desc": "404"
}
```

通过接口调用 http://ollama-webui.example.com/api/chat 测试用例：

```json
{
    "model": "deepseek-r1:14b",
    "messages": [
        {
            "role": "user",
            "content": "请直接给出结果，不要思考过程：[帮我查询明天的天气]"
        },
        {
            "role": "system",
            "content": "你现在是一个系统助手，以下是定义好的的指令，定义好的指令格式为“指令名称: 指令解释”\n\n\nGEN_DAY_REPORT: 生成日报表\nGEN_MONTH_REPROT: 生成月报表\nGEN_YEAR_REPORT: 生成年报表\nSUMMARY_EMPLOYEE_LIST: 查询员工列表\nSUMMARY_EMPLOYEE_DETAIL: 查询员工详情\nSUMMARY_DEPT: 查询部门\n\n可能涉及到的查询条件对应的英文:\n\n开始时间: startDate\n结束时间: endDate\n部门: deptName\n时间: date\n员工名称: employeeName\n\n如果参数涉及到了时间，时间的格式参考2025-02-07 14:38:01\n\n需要根据用户的输入匹配系统提前定义好的指令，不要思考过程，只返回如下的结构\n\n{\n  \"task\": <指令名称>,\n  \"desc\": <指令解释>,\n  \"params\": <查询条件>\n}\n\n如果没有匹配到任何指令，不要思考过程，只返回\n\n{\n  \"task\": \"NOT_FOUND\",\n  \"desc\": \"404\"\n}"
        }
    ],
    "options": {
        "temperature": 0.1,
        "top_p": 0.1
    },
    "stream": false
}
```

上面的请求尝试多次均可以准确匹配命令，但是还需要大规模数据的验证。<think></think>标签中返回的是模型的思考过程，模型思考结束直接返回固定的json结构数据，可交给系统继续处理。

```json
{
    "model": "deepseek-r1:14b",
    "created_at": "2025-02-08T06:23:35.196878118Z",
    "message": {
        "role": "system",
        "content": "</think>\n好，我现在需要处理用户的查询：“查询2024年1月2号的日报”。首先，我要分析这个请求属于哪个指令。用户提到了“日报”，这可能对应生成日报表的任务。\n\n接下来，查看定义好的指令列表，GEN_DAY_REPORT 是生成日报表的指令，符合用户的需求。因此，任务应该是 GEN_DAY_REPORT。\n\n然后，确定参数部分。用户明确指定了日期是2024年1月2号，所以需要将这个日期作为查询条件。根据格式要求，时间参数需要用 YYYY-MM-DD 格式，这里正好匹配。\n\n最后，构建响应结构，包含 task、desc 和 params 三个字段。task 设为 GEN_DAY_REPORT，desc 是生成日报表的解释，params 包含 date 参数设置为指定日期。\n</think>\n\n```json\n{\n  \"task\": \"GEN_DAY_REPORT\",\n  \"desc\": \"生成日报表\",\n  \"params\": {\n    \"date\": \"2024-01-02\"\n  }\n}\n```"
    },
    "done_reason": "stop",
    "done": true,
    "total_duration": 5348766404,
    "load_duration": 8896988,
    "prompt_eval_count": 252,
    "prompt_eval_duration": 96000000,
    "eval_count": 218,
    "eval_duration": 5240000000
}
```