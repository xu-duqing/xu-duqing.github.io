title: 初识React-Native
tag:
	-React-Native
	-Android
date: 2015-11-22 14:02:00
---
[上一章](/2015/11/21/React-Native之Android开发/)我们成功的运行起了一个ReactNativeForAndroid的App。今天我们从index.android.js开始，介绍React-Native是如何工作的。
<!--more-->

### 初识React-Native

将ReactNativeForAndroid目录导入到编辑器，建议Sublime。前端同学推荐的，我也没用过别的，因为这个足够好用。打开index.android.js文件.
简单把代码分层四块。

#### 1、声明

相当于JAVA中的"import"这里声明了要引用的组件，首先当然是react-native组件，这个组件中包括了React封装的一些基础组件包括Text、ListView等...第二个定义看上去有点怪，其实就是一个语法糖，相当于"Text = React.Text".  

```
	var React = require('react-native');
	var {
	  AppRegistry,  //JS 入口
	  StyleSheet,	//样式
	  Text,			//就是Android的TextView
	  View,			//相当于Android的Layout
	} = React;
```

#### 2、组件

组件的概念是React的基础，有机会我会单独拿出来聊聊。简单说就是通过React.createClass()创建组件。然后通过render：function(){}；他返回当前组件显示的View。语法看上去感觉有点想是Android开发中layout.xml，React引用了一个新的语法jsx。将布局代码和js代码融合在一起，看上去比较奇怪。但是学习和使用起来真的是无比的方便。

```
	var ReactNativeForAndroid = React.createClass({
	  render: function() {
	    return (
	      <View style={styles.container}>
	        <Text style={styles.welcome}>
	          Welcome to React Native!
	        </Text>
	        <Text style={styles.instructions}>
	          To get started, edit index.android.js
	        </Text>
	        <Text style={styles.instructions}>
	          Shake or press menu button for dev menu
	        </Text>
	      </View>
	    );
	  }
	});
```

#### 3、样式

用于定义View的Style，控制View显示的大小，颜色，位置等....顺便说一句，学习react-native之前最好了解一些前端基础。

```
	var styles = StyleSheet.create({
	  container: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: '#F5FCFF',
	  },
	  welcome: {
	    fontSize: 20,
	    textAlign: 'center',
	    margin: 10,
	  },
	  instructions: {
	    textAlign: 'center',
	    color: '#333333',
	    marginBottom: 5,
	  },
	});

```

#### 4、注册入口

下图为React组件组织示意图：

![React组件组织示意图](https://raw.githubusercontent.com/xu-duqing/res/master/image/React%E7%BB%84%E4%BB%B6%E7%BB%84%E7%BB%87%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

React作为高度组件化的框架，开过过程中通过不断的拆分和构建组件，直到完成整个组件树的构成。树的父节点就是这个出口组件，APP在通过"AppRegistry.registerComponent()"注册这个入口组件以达到整个APP展示。注意：只可以注册一个入口。


```
	AppRegistry.registerComponent('ReactNativeForAndroid', () => ReactNativeForAndroid);

```

简单了解了一下React的代码结构。相信大家都能够动起来开发自己的React-Native应用了吧。当然你得了解更多的组件才行。下期就给大家介绍几个常用组件的使用。