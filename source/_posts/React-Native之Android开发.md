title: React-Native之Android开发
tag:
	-React-Native
	-Android
date: 2015-11-21 10:02:00
---

### 导读的导读
距FeachBook发布React-Native也有段时间了，最初以为只是前端搞出的一个新玩具罢了，无非就是用java script可以开发IOS应用。发布的时候就看过并写了一个demo，由于对前端的技术不熟悉并没有感觉有什么卵用，最多就是觉得js比OC好学一点就没怎么关注。后来听说还可以开发Android应用并且可以和IOS共用一份代码，一下吸引了大家的眼球。“一次编写，处处运行”多么美好的愿景。于是一直期盼这Android版本的发布，9月15号终于发布了。我也是第一时间将之前写的demo成功的在Android平台上运行，很激动。当然并不是很顺利，还是改了一些不兼容的代码。  

<!--more-->

Android版本的发布点燃了开发者的热情，有人又在说“JS要一统江湖啦！”。唉 为什么要说又。因为JS一统江湖是隔段时间就被提起的话题，nodejs发布、HTML5发布、phonegap发布 ^_^。js能不能统一江湖我不知道，但是React-Native确实从“理论上”解决了当前客户端开发的一些痛点。

### 聊聊痛点


#### 跨平台
客户端的平台分化绝对是一个永恒的痛点，从目前的情况看来Android和IOS谁也不可能做到统一，当然还有WP。那么当你有要开发一个APP不得不招一个IOS团队和一个Android团队如果涉及到服务端你还得招服务端开发。React-Native虽并没能做到“一次编写，处处使用”，但确实可以如官网所说的“learn once, write anywhere”。服务端用nodeJS、前端用react、客户端使用react-native。统一团队的技术栈可以极大的缩减成本。

#### 热部署
互联网软件发展至今技术已经如此成熟，而客户端还在使用古老的桌面软件的方式发布这版本。虽然Android现在已经有了不错的热修复的框架，但暂时还是无法满足大功能的更新和上线。而JS代码天生就是支持服务端更新。

#### Web体验
如果仅仅是上面两点，可以把应用做成web软件phonegap、hybrid就是这样设计的。可在客户端Web的体验又是那么让人无法接受。但是React-Native是调用的原生的View所以和原生的体验并没有区别。

### Hello world
聊了这些是不是有点跃跃欲试了，接下来就从如何在Android上运行第一个React-Native程序Hello world。

#### 1、准备环境
首先必须有一台MAC，Linux和Window也支持了。但是环境比较麻烦我也没有。

安装Node.js和npm。   
版本：
```
	➜ /Users/xxxxx >node -v
	v4.0.0
	➜ /Users/xxxxx >npm -v
	2.14.2
```
其次我们要运行Android项目，当然少不了JDK 和 Android-SDK。并配置Android开发环境，这里就不做详细的介绍了。  
做Android开发的应该都是有这套环境的。

#### 2、安装React-native

```
	npm install -g react-native-cli
```

#### 3、创建项目

这一步有点慢特别是第一次要下载一个约84M的源码,并且要翻墙...我第一次创建花了30多分钟

```
	react-native init ReactNativeForAndroid
```

#### 4、启动Android虚拟机

推荐使用Genymotion，Google出的那个太卡了。

#### 5、Runing

```
	react-native run-android
```

OK 稍等片刻，React会将JS代码打包到8081端口上的一个JS-server。安装并启动APP从8081端口上获取js代码，然后运行JS代码得到界面。

![React-Native start](https://raw.githubusercontent.com/xu-duqing/res/master/image/44C833E3-11A5-4809-8F4A-231998D4E91B.png)

### 目录介绍

不着急了解具体代码，我们先从目录结构看起。

```
.
├── android 	//android 项目目录
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   └── settings.gradle
├── index.android.js  	//android 启动文件
├── index.ios.js 		//IOS 启动文件
├── ios  	//IOS 项目目录
│   ├── ReactNativeForAndroid
│   ├── ReactNativeForAndroid.xcodeproj
│   └── ReactNativeForAndroidTests
├── node_modules 		//第三方模块包
│   └── react-native
└── package.json 		//描述文件

```
从目录上可以看出，React-Native肯定是做不到“一处编写，处处运行”的了，还做了平台区分的有两个启动文件。除了多了一个Android和iso目录以外就是一个符合commonJs规范的JS包。其中```package.json```为项目的描述文件。

现在我们就成功的在Android上运行起了一个React-Native的APP。下期在带大家看看React-Native的代码。[初识React-Native](/2015/11/22/初识React-Native/)
