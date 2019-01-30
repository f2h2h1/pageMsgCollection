## 说明
- 这是一个简单的用于收集页面消息的库，主要用于收集错误消息
- 数据会以 JSON 字符串的格式发送给后台

## 兼容
- 作者测试过 Firefox 64, Chrome 71, IE 11, Edge

## 快速开始
1. 在加载其它 JavaScript 之前引入 pageMsgCollection.js
2. 在引入 pageMsgCollection.js 之后调用初始化方法
```javascript
pageMsgCollection.init({
    'url': 'your address',
    'pageInfo': {
        'form': 'test page',
    }
});
```
3. 在初始化完成之后，页面上未被 catch 的 JavaScript 异常会被发送到初始化时填写的地址
4. 当然，你也可以主动发送消息，就像这样
```javascript
pageMsgCollection.sendInfo('this is a msg');
```

## 实现思路
1. 使用 addEventListener 方法监听 window 对象的 error 事件
2. 封装一个 ajax 函数
3. 当 window 对象的 error 事件发生时，获取 error 的相关信息，并发送给后台

## 注意
- 对于跨域引用，window.onerror 是没有详细信息的。这时 script 标签需要多加一个 crossorigin 的属性。同时响应头需要有 Access-Control-Allow-Origin。这样就能获得 window.onerror 的详细信息。   

- 如果 JavaScript 代码经过压缩或编译，那么需要 Source Map 才能准确定位到错误位置，这个库只能上报原始的位置。

## 目录结构
```plaintext
├─pageMsgCollection.js    库
├─test.html               测试页面
├─putMsg.php              配合测试页面的后台脚本
```

## 更多
1. 获取版本号
```javascript
let version = pageMsgCollection.getVersion();
```
2. 获取初始化时的参数
```javascript
let _default = pageMsgCollection.getDefault();
```
3. 发送消息到其它 url
```javascript
pageMsgCollection.sendInfo({
    url: 'new url'
    data: {
        msg: 'this is a msg'
    }
});
```
4. 不使用缺省的 pageInfo
```javascript
pageMsgCollection.sendInfo({
    data: {
        pageInfo: {}
        msg: 'this is a msg'
    }
});
```
5. 自定义浏览器信息
```javascript
pageMsgCollection.sendInfo({
    data: {
        browserInfo: {
            appName: 'no Netscape',
            userAgent: 'new ua'
        }
        msg: 'this is a msg'
    }
});
```
6. init 方法可以调用多次，每次调用会覆盖上一次的设置
