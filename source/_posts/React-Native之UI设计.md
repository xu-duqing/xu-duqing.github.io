title: React-Native之UI设计
date: 2015-11-30 01:04:44
tags:
	-Android
	-React-Native
---
React设计的初衷就是为前端提供可复用、高性能的UI组件。引申到Native自然也是以此为目的。有消息称之后还要解决Native的逻辑部分，虽说完全有这个可能。但就当前情况而言如何丰富组件才是React-Native的首要任务。接下来我们就来了解下如何运用React提供的组件进行UI设计。


UI层重要的两个元素，一是组件，二是样式（控制组件的显示）

这篇只是一个组件使用的入门教程，不会文档式的介绍组件中的参数，只是从几个demo出发介绍基本的使用及概念。想要得到更丰富的props还是需要去React-Native的文档中查看。
<!--more-->
### 组件(COMPONENTS)
React-Native通过重写的方式实现了从React的组件到Android的View的转换，有机会我还会仔细讲讲他们是怎么转换的并且是如何进行通信的。这次主要了解怎么用。从官方的文档可以了解到，现在已经实现了Android和IOS所有的基础的组件，由于Android和IOS的View 接口有很大的不同，React在设计的时候也无法做到完全一致。所以这种的兼容性代码还是省不了的。接下来介绍几个基础的组件。

### 样式(STYLE)
其实样式不应该单独拎出来讲的，因为它不可能单独存在必须依附组件。控制着组件在窗口上的显示。如颜色、宽高、间距等。

先来看段代码：

```
	<View style={styles.container}>
        <View style={styles.containerRow}>
          <Text style={styles.welcome}> 
              第一行,第一列
          </Text>

          <Text style={styles.welcome}> 
              第一行,第二列
          </Text>
        </View>

        <View style={styles.containerRow}>
          <Text style={styles.welcome}> 
              第二行,第一列
          </Text>

          <Text style={styles.welcome}> 
              第二行,第二列
          </Text>
        </View>
     </View>

     var styles = StyleSheet.create({
	  container: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: '#F5FCFF',
	  },
	  containerRow: {
	    flex: 1,
	    flexDirection: 'row',
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: '#F5FCFF',
	  },
	  welcome: {
	    fontSize: 20,
	    textAlign: 'center',
	    margin: 10,
	  },
	});

```

#### 实现的效果如下：  

![View及Text显示demo](https://raw.githubusercontent.com/xu-duqing/res/master/image/QQ20151129-0.png)

这个demo中用到了两个组件“View、Text”


#### View
View，和Android中定义的View有所区别，React-Native中对它的定义相当于\<div\> 对应Android中的对象应该Layout。对照上面代码应该很好理解。其中的style，定义的是显示的样式。稍后会说到。
#### Text
对应Android中的TextView，用于显示一段文本内容。

#### style
作为组件的最基础属性，理论上所有的组件都有这个属性。style有多种定义方式。

1、直接写到组件中 

```
	<Text
		style = {{
		fontSize:20
		fontWeight: 'bold'
		color:'red'}}>
		Hello world
	</Text>
```

2、引用样式表

```
	<Text style={styles.text}>
		Hello world
	</Text>

	styles = StyleSheet.create({

		text{
			fontSize:20,
			fontWeight: 'bold',
			color:'red',
			},
		});
```

3、当然也可以定义一个style.js的文件，让后通过require引用进来使用。


#### 简单解释一下demo中的样式都是什么意思

react的空间布局使用的是FLex方案，前端比较灵活的布局方案。简单的理解就是配置空间中组件的位置。推荐两篇博客介绍的特别详细。   
[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)  
[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

但是为了兼容Native开发，react对FLex做了一些改造和阉割。因为很多布局客户端不支持。为了方便Android开发的同学理解，做了和Android布局的对比。

```
container: {
    flex: 1, // 指定方向上占布局的比例，如果没有其他元素这代表填满。相当于Android布局中的"layout_weight"
    justifyContent: 'center',  // 指定方向上的对齐方式，垂直居中对齐。参数有“flex-start | flex-end | center | space-between | space-around”
    alignItems: 'center', // 子元素在指定方向上的对齐方式 相当于Android布局中的“gravity”
    backgroundColor: '#F5FCFF', //背景颜色
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',  // 布局方向，默认是垂直。
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20, // 字体大小，单位pt
    textAlign: 'center',  //文本对齐样式
    margin: 10, // 边距大小，相当于Android布局中的"layout_margin"
    padding: 10, // 距内偏移大小，相当于Android布局中的“padding”
    fontWeight: 'bold', //字体粗细样式
    color:'red', //字体颜色
  },
```

#### Image 图片组件

```
	<Image 
		style = {styles.img}
		resizeMode = {Image.resizeMode.contain}
		source = {{uri: "http://image.beekka.com/blog/2015/bg2015033101.png"}}/>
	);

	styles = StyleSheet.create({
		img{
			flex:1,
		},
	});
```

图片组件使用也比较简单，source指定图片内容，resizeMode指定显示样式。

#### source

//显示一直远程图片
```
source = {{uri:'http://image.beekka.com/blog/2015/bg2015033101.png'}}
```
//显示一直本地图片，针对Android drawable文件夹中的图片。
```
source={require('image!ic_arrow_back_white_24dp')}
```

#### resizeMode 有三种样式 contain, cover, stretch

##### contain
自适应宽高

![contain](https://raw.githubusercontent.com/xu-duqing/res/master/image/QQ20151130-0.png)


##### cover
默认 完整显示，会被截取。

![cover](https://raw.githubusercontent.com/xu-duqing/res/master/image/QQ20151130-1.png)

##### stretch
拉升已适应全屏 

![stretch](https://raw.githubusercontent.com/xu-duqing/res/master/image/QQ20151130-2.png)

OK 样式的介绍大致就这么多，希望能够帮助到大家。下一章希望给大家介绍一下ListView 的使用