title: 使用javassist修改apkpatch包
date: 2015-12-23 18:22:07
tags:
	-javassist
	-apkpatch
	-android
---


### 起因
公司在使用AndFix的时候发现用阿里提供的apkpatch工具生成的patch包少了很多内容，仔细一查发现我们用了multiDex进行分包。而查看apkpatch代码发现只对classes.dex进行了比较。由于阿里并没有将这个开源，于是只能修改jar包了。当然有很多方法这里用的是javassist这个库做的。这篇文章目的就是介绍如何使用javassist修改jar包。
<!--more-->
![](https://raw.githubusercontent.com/xu-duqing/res/master/image/4B3C7865-4670-4D28-97AF-BD07A39266B6.png)

至于javassist是什么这里就不做详细介绍了，可以查看它的官网[http://www.javassist.org](http://www.javassist.org)。
### 1、获取javassist库
[https://github.com/jboss-javassist/javassist](https://github.com/jboss-javassist/javassist)下载最新的库。

### 2、新建JAVA工程，并导入javassist

### 3、在Main函数中添加代码

```
		//获取Pool实例
        ClassPool pool = ClassPool.getDefault();
        //加载要修改的jar包
        pool.insertClassPath("./assets/apkpatch-1.0.3.jar");
        //获取要修改的类
        CtClass ccMain = pool.get("com.euler.patch.Main");
        //获取要修改的方法，并在方法前插入代码“System.out.println("代码插入");”
        ccMain.getDeclaredMethod("main").insertBefore(" System.out.println(\"代码插入\");");
        //生成新的class
        ccMain.writeFile();
```

### 4、run
点击运行会在项目目录下生成修改后的class，并生成完整的目录。

![](https://raw.githubusercontent.com/xu-duqing/res/master/image/7609226D-9257-4B9C-9050-58CDF55E2C0C.png)


### 5、将class打包到jar包中
#### window环境：
- 修改jar包名称为zip后解压
- 找到对应的class文件并替换掉
- 压缩，修改后缀为jar

#### mac环境
使用jar命令 （这个命令window也可以用）

jar uvf ./assets/apkpatch-1.0.3.jar com/euler/patch/Main.class

Ok 大致的修改流程就是这样，javassist还有很多的操作符，比如setBody、make等非常丰富。可以方便的修改jar包中的代码。

### 6、注意
我在用的时候遇到几个坑

- 不支持泛型
- 引用外部的类需要带上完整包名，不然找不到。
    
