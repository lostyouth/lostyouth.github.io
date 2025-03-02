---
title: Web Worker
tags:
  - 前端
createTime: 2021/01/17 16:21:01
permalink: /article/f1bdg4fs/
---
# Web Worker

## 什么是 Web Worker

我们知道JavaScript是一个单线程的语言，之所以这样设计是因为浏览器刚开始的功能比较简单，浏览器显示的内容都是服务端生成好的html。后来加入了JavaScript，JavaScript可以直接操作Dom、发送异步消息等，加上前端各种框架的发展，使得浏览器功能越来越强大。由于各种原因JavaScript还是保持了单线程的设计，最主要还是JavaScript可以操作浏览器的Dom树，如果设计成多线程会增加复杂度。浏览器运行JavaScript采用事件驱动的方式，通过事件队列来处理异步任务，也可以高效的处理各种并发。但是单线程的设计使得JavaScript在处理复杂任务时会出现阻塞主线程的情况，因此Web Worker应运而生。

Web Worker 为 Web 内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。Web Worker不能使用DOM API，他们不能访问window对象，也不能使用document对象。但是可以访问navigator对象和location对象。此外，他们可以使用 XMLHttpRequest 对象执行 I/O（尽管该对象将限于同源 URL）。一旦创建，一个 Worker 可以继续运行，即使主脚本已经关闭。

[Web Worker标准](https://html.spec.whatwg.org/multipage/workers.html)

[Web Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)

[阮一峰的Web Worker 使用教程](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)

## Web Worker 的使用

Web Worker的使用主要还是为了避免在主线程中执行复杂任务导致阻塞主线程，导致页面卡顿等问题，因此Web Worker主要还是用于处理复杂任务。

```ts
// excel.worker.ts
import ExcelJS from 'exceljs';

// onmessage事件
onmessage = function (e) {
  const {
    data: { columns, dataSource },
  } = e;
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表
  const worksheet = workbook.addWorksheet('sheet1');
  // 设置表格内容
  const _titleCell = worksheet.getCell('A1');
  _titleCell.value = 'Hello ExcelJS!';
  const workBookColumns = columns.map((item) => ({
    header: item.title,
    key: item.key,
    width: 32,
  }));
  worksheet.columns = workBookColumns;
  worksheet.addRows(dataSource);
  // 导出表格
  workbook.xlsx.writeBuffer().then((buffer) => {
    let _file = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    // 将获取的数据通过postMessage发送到主线程
    self.postMessage({
      data: _file,
      name: 'worker test',
    });
    self.close();
  });
};
```

```ts
import ExcelWorker from './excel.worker?worker';

const workerExportExcel = async () => {
   const _file = await new Promise((resolve, reject) => {
     const myWorker = new ExcelWorker();
     myWorker.postMessage({
       columns,
       dataSource,
     });
     myWorker.onmessage = (e) => {
       resolve(e.data.data); // 关闭worker线程
       myWorker.terminate();
     };
   });
   FileSaver.saveAs(_file, 'ExcelJS.xlsx');
};

workerExportExcel()
```