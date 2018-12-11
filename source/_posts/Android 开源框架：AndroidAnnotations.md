title: android开源框架 annotations配置
tag:
	-注解
	-Android
date: 2014-12-11 10:58:00
---

最近在用这个代码注入框架，的确方便很多简化了代码。但是使用的时候发现配置还挺麻烦，这里就比讲怎么使用了，网上教程也很多。具体讲讲怎么配置。
<!--more-->

###其主要功能有如下几点：
1. 使用依赖注入（Dependency Injection）
2. 简化的线程模型（Simplified  threading model) 
3. 事件绑定（Event binding）
4. REST Client
5. No Magic 

>具体都是什么意思自己Google一下吧，这里主要讲怎么配置的。

当我们新建以后项目之后，需要在build.gradle中引入annotation的架包
###配置如下

	dependencies {
	    compile fileTree(dir: 'libs', include: ['*.jar'])
	    apt "org.androidannotations:androidannotations:3.2"
	    compile "org.androidannotations:androidannotations-api:3.2"
	}

> [CustomizeAnnotationProcessing](https://github.com/excilys/androidannotations/wiki/CustomizeAnnotationProcessing)这里有annotations的相关文档可以简单了解一下

从上面配置中可以看出annotation需要Android-apt的支持所以还得在工程中引入android-apt

> [android-apt](https://bitbucket.org/hvisser/android-apt)
这里有Android-apt的相关配置

简单来说分为3步

1. 获取最新版本的android-apt插件

> 
	dependencies {
        classpath 'com.android.tools.build:gradle:1.0.0'
        classpath 'com.neenbedankt.gradle.plugins:android-apt:1.4'
    }

2. 配置插件 

> 
	apply plugin: 'com.neenbedankt.android-apt'

3. 配置处理参数

> 

	apt {
	    arguments {
	    		//resourcePackageName "项目命名空间"
	    		resourcePackageName "com.sam.example.androidannotationsexample"
	            
	            androidManifestFile variant.outputs[0].processResources.manifestFile
	    }
	}



###最后帖出完整配置

>
	
	// Top-level build file where you can add configuration options common to all sub-projects/modules.
	buildscript {
	    repositories {
	        jcenter()
	    }
	    dependencies {
	        classpath 'com.android.tools.build:gradle:1.0.0'
	        classpath 'com.neenbedankt.gradle.plugins:android-apt:1.4'

	        // NOTE: Do not place your application dependencies here; they belong
	        // in the individual module build.gradle files
	    }
	}

	allprojects {
	    repositories {
	        jcenter()
	    }
	}


>

	apply plugin: 'com.android.application'
	apply plugin: 'com.neenbedankt.android-apt'

	android {
	    compileSdkVersion 21
	    buildToolsVersion "21.1.1"

	    defaultConfig {
	        applicationId "com.sam.example.androidannotationsexample"
	        minSdkVersion 9
	        targetSdkVersion 21
	        versionCode 1
	        versionName "1.0"
	    }
	    buildTypes {
	        release {
	            minifyEnabled false
	            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
	        }
	    }
	}

	dependencies {
	    compile fileTree(dir: 'libs', include: ['*.jar'])
	    compile 'com.android.support:appcompat-v7:21.0.2'
	    apt "org.androidannotations:androidannotations:3.2"
	    compile "org.androidannotations:androidannotations-api:3.2"
	}

	apt {
	    arguments {
	        resourcePackageName "com.sam.example.androidannotationsexample"
	        androidManifestFile variant.outputs[0].processResources.manifestFile
	    }
	}



最后，记住使用annotation的对象一定要加下划线并build一下。

OK  玩耍去吧！！
