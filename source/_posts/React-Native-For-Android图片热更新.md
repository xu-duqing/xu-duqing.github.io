title: React-Native-For-Android图片热更新
date: 2016-07-27 22:32:32
tags:
    -React-Native
    -Android
---

RN对图片加载支持了很多套方案，

```javascript
//加载远程图片
<Image source={{url:'http://www.wacai.com/icon.png'}} />
//加载res类的图片
<Image source={{url:'icon'}} />
//加载指定文件系统的图片
<Image source={{url:'file:///sdcard/icon.png'}} />
//这个比较流弊，请看下文介绍
<Image source={require('./assets/img/icon.ong')} 
```

<!--more-->

为啥讲require的方式比较流弊了，废话不流弊FB会推荐这种方案嘛！我们的图片热更新全靠他了好吗！网上的那些什么图片热更新的教程都别看。FB在21的版本上已经完美解决了。 完美....

### 热部署
RN在19之前都是将图片打包到res文件夹，通过图片名称找到对应的ID，然后找到图片的。下面是Android的实现。
```javascript
public int getResourceDrawableId(Context context, @Nullable String name) {
    if (name == null || name.isEmpty()) {
      return 0;
    }
    name = name.toLowerCase().replace("-", "_");
    if (mResourceDrawableIdMap.containsKey(name)) {
      return mResourceDrawableIdMap.get(name);
    }
    int id = context.getResources().getIdentifier(
        name,
        "drawable",
        context.getPackageName());
    mResourceDrawableIdMap.put(name, id);
    return id;
  }
```
但是要知道res文件夹是没有访问权限的啊....那么我们代码更新了，图片要更新改怎么办，怎么办嘛。

后来微软的一位做CodePush的作者看不下去了，CodePush是什么请谷歌一下。于是咔咔把RN的加载代码重构了。FB看了说"我去,完美解决嘛!"于是尴尬的合并的代码。

### 那么问题来了，是怎么解决的了！
首先通过require获取资源的时候回判断是否为开发状态“DEV”,开发状态就通Node服务中获取资源地址，非开发状态就去组装native的资源地址
```
devServerURL ? getPathOnDevserver(devServerURL, asset) : getPathInArchive(asset),
```
根据不同的平台获取拼接不同的目录,其中 offlinePath 是从native配置的资源目录决定的。

```
function getOfflinePath() {
  if (_offlinePath === undefined) {
    var scriptURL = SourceCode.scriptURL;
    var match = scriptURL && scriptURL.match(/^file:\/\/(\/.*\/)/);
    if (match) {
      _offlinePath = match[1];
    } else {
      _offlinePath = '';
    }
  }

  return _offlinePath;
}

function getPathInArchive(asset) {
  var offlinePath = getOfflinePath();
  if (Platform.OS === 'android') {
    if (offlinePath) {
      // E.g. 'file:///sdcard/AwesomeModule/drawable-mdpi/icon.png'
      return 'file://' + offlinePath + getAssetPathInDrawableFolder(asset);
    }
    // E.g. 'assets_awesomemodule_icon'
    // The Android resource system picks the correct scale.
    return assetPathUtils.getAndroidResourceIdentifier(asset);
  } else {
    // E.g. '/assets/AwesomeModule/icon@2x.png'
    return offlinePath + getScaledAssetPath(asset);
  }
}
```

### OK 那么我们该如何做图片的热部署。

首先我没有要定义一个js脚步目录，可以是data目录也可以是SdCard。注意一定要以/开头，就算编译器告诉你这样可能不对也得以/开头。

```
protected String getJSBundleFile() {
  return "/sdcard/bundle/index.android.bundle";
}
```
然后打包，把打出的bundle和图片放到这个目录下。打开你APP玩耍吧....

>作者 大光 [更多文章](http://www.daguang.me) | [Github](https://github.com/xu-duqing)
