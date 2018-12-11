title: 两种往WebView中注入CSS的方式
date: 2016-08-02 00:22:45
tags:
    -js
    -WebView
    -CSS注入
    -Android
---

## 前言

两年前有个项目需要在WebView中修改H5的样式，当时为解决这个问题还是费了一点时间。今天同事也遇到类似的需求找到我，于是决定整理出来供有需要的人参考。
<!--more-->

## 方式一
>利用JS将获取页面中的Head标签中的style并添加样式。然后通过loadUrl的方式加载这段js就可以了。

```javascript
javascript:
var tagHead =document.documentElement.firstChild;
var tagStyle = document.createElement("style");
tagStyle.setAttribute("type", "text/css");
tagStyle.appendChild(document.createTextNode("<style>#header {display:none;!important}</style>"));
var tagHeadAdd = tagHead.appendChild(tagStyle);
```


## 方式二
> 利用WebView加载的资源的回调。  

API 11之后WebView提供了shouldInterceptRequest的回调接口，此接口是拦截页面中的所有资源加载包括（CSS、JS、Image）。我们可以通过此回调修改加载的数据并返回。如果返回null则默认加载网络。代码如下：

```
 public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
    if (url.contains(".css")) {
        WebResourceResponse resourceResponse = null;

        File cssFile = new File("file://assets/xxx.css");
        if (cssFile.exists() && cssFile.length() > 0) {
            InputStream in = null;
            try {
                in = new FileInputStream(cssFile);
                resourceResponse = new WebResourceResponse("text/css", "UTF-8", in);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
        }

        if (resourceResponse != null)
            return resourceResponse;
    }
    return super.shouldInterceptRequest(view, url);
}
```

这样我们就将网页中的css替换成了本地的css。当然这种方式能替换所有网页上的资源。就看你的需求啦。
