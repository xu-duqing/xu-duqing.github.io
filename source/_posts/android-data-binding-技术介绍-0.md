layout: android
title: android-data-binding-技术介绍-0
date: 2015-08-01 21:38:53
tag: 
	- Android
	- data binding
	- MVVM
---
Data binding (双向绑定)是Google在今年的IO大会上推出的一套数据绑定框架，其目的是为了使Android的开发支持上MVVM框架，减少代码耦合。使Android开发更加的易于维护，易于测试。首先简单的带大家了解下MVVM是什么。

<!--more-->

### MVVM是什么？
我们一步步来，从MVC开始。
MVC 我们都知道，模型——视图——控制器。为了使得程序的各个部分分离降低耦合性，我们对代码的结构进行了划分。
![MVC 示意图](http://image.beekka.com/blog/2015/bg2015020105.png)
他们的通信方式也如上图所示，即View层触发操作通知到业务层完成逻辑处理，业务层完成业务逻辑之后通知Model层更新数据，数据更新完之后通知View层展现。在实际运用中人们发现View和Model之间的依赖还是太强，希望他们可以绝对独立的存在，慢慢的就演化出了MVP。
![MVP 示意图](http://image.beekka.com/blog/2015/bg2015020109.png)
Presenter 替换掉了Controller，不仅仅处理逻辑部分。而且还控制着View的刷新，监听Model层的数据变化。这样隔离掉View和Model的关系后使得View层变的非常的薄，没有任何的逻辑部分又不用主动监听数据，被称之为“被动视图”。

![MVVM 示意图](http://image.beekka.com/blog/2015/bg2015020110.png)
至于MVVM基本上和MVP一模一样，感觉只是名字替换了一下。他的关键技术就是今天的主题(Data Binding)。View的变化可以自动的反应在ViewModel，ViewModel的数据变化也会自动反应到View上。就样开发者不用就处理接收事件和View更新的工作，框架就帮你做好了。


OK 大家对MVVM应该有所了解了吧。下一章就来说说Data Binding怎么使用。[Android Data Binding 技术介绍(1)](/2015/08/04/android-data-binding-技术介绍-1/)
