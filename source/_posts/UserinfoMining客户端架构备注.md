title: UserinfoMining客户端架构备注
tags:
  - Android
date: 2014-11-26 14:27:23
---
关于用户信息挖掘项目Android客户端的相关备注及规范
<!--more-->
###严格遵循Material Design。

>Material Design。
Google 在2014的I/O大会上发布的新一代设计规范，目的是提供更一致、更广泛的“外观和感觉”。使用这一规范能够使得设计更加的简单和统一。
具体的可以参见 [Material Design 中文版](http://design.1sters.com/)

###使用Androidannotations进行View层开发

>Androidannotations是视图的代码注入框架，能够减少View开发中重复代码，提升效率。
使用起来相对简单，具体可参加 [博客](http://blog.csdn.net/zjbpku/article/details/18676149)

###使用ActiveAndroid进行数据层开发
>用过最方便的ORM框架，项目中已经引用了。也写了demo。
具体的使用方法参见 [ActiveAndroid](http://xu-duqing.github.io//2014/11/26/ActiveAndroid/)

###使用volley进行网络框架开发
>还不了解，具体有待实现

###使用JSON做数据交互
>相比较而言msgPack更具有优势， 但是有一定学习曲线，还是JSON简单明了。加上Google出品的GSON。使用起来还是很方便的。
等数据传输出现瓶颈的时候在考虑MsgPack吧

>作者 大光 [更多文章](http://www.daguang.me) | [Github](https://github.com/xu-duqing)