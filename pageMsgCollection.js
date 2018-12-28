(function (global, factory) {

    let pageMsgCollection = factory();

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = pageMsgCollection;
    } else if (typeof define === 'function' && define.amd) {
        define([], function () {
            'use strict';
            return pageMsgCollection;
        });
    } else {
        global.pageMsgCollection = pageMsgCollection;
    }

})(typeof window !== "undefined" ? window : this, function() {

    var VERSION = '0.0.1';

    var _default = {
        url: '',
        pageInfo: '',
        browserInfo: {
            appName: navigator.appName,
            userAgent: navigator.userAgent
        }
    };

    function ajax(options) {
        options = options || {};
        options.type = (options.type || 'GET').toUpperCase();
        if (!options.url) {
            return;
        }
        let params = options.data || '';

        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else {
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.error && options.error(status, xhr.responseText);
                }
                options.complete && options.complete();
            }
        }

        if (options.type == 'GET') {
            xhr.open('GET', options.url + '?' + params, true);
            xhr.send(null);
        } else if (options.type == 'POST') {
            xhr.open('POST', options.url, true);
            if (!options.contentType) {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            } else {
                xhr.setRequestHeader("Content-Type", options.contentType);
            }
            xhr.send(params);
        }
    }

    function formatParams(data, type) {
        type = type || 'json';
        if (type == 'json') {
            data = JSON.stringify(data);
        }
        return data;
    }

    function handleError(e) {
        let errorInfo = {};
        errorInfo.filename = e.filename || '';
        errorInfo.lineno = e.lineno || '';
        errorInfo.colno = e.colno || '';
        errorInfo.message = e.message || '';
        errorInfo.stack = e.error.stack || '';
        errorInfo.timestamp = Math.round(new Date().getTime()/1000);
        errorInfo.errid = randomString(64);
        sendInfo({
            data: {
                errorInfo: errorInfo,
                pageInfo: _default.pageInfo
            }
        });
    }

    function sendInfo(param) {
        if (!param) {
            return;
        }

        let data = param.data || {};
        data.pageInfo = param.data.pageInfo || _default.pageInfo;
        data.browserInfo = param.data.browserInfo || _default.browserInfo;

        let dataType = '';
        if (!param.dataType) {
            contentType = 'application/json;charset=UTF-8';
            dataType = 'json';
        } else {
            dataType = param.dataType;
        }
        data = formatParams(data, dataType);

        ajax({
            'url': param.url || _default.url,
            'type': param.type || 'POST',
            'contentType': contentType,
            'data': data || '',
            'success': param.success || '',
            'error': param.error || '',
            'complete': param.complete || '',
        });
    }

    function randomString(len) {
        len = len || 32;
        let $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    var pageMsgCollection = function () {
        window.addEventListener('error', handleError);
        return this;
    };

    pageMsgCollection.prototype.init = function (param) {
        if (!param) {
            return;
        }
        if (param.url) {
            _default.url = param.url;
        }
        if (param.pageInfo) {
            _default.pageInfo = param.pageInfo;
        }
    }

    pageMsgCollection.prototype.sendInfo = function (param) {
        if (Object.prototype.toString.call(param) === "[object String]") {
            sendInfo({
                data: {
                    msg: param
                }
            });
        } else {
            sendInfo(param);
        }
    }

    pageMsgCollection.prototype.getDefault = function () {
        return _default;
    };

    pageMsgCollection.prototype.getVersion = function () {
        return VERSION;
    };

    return new pageMsgCollection();
});
