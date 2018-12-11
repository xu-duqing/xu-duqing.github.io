title: Android ORM库ActiveAndroid介绍
tag: 
	-Android
	-ORM
date: 2015-3-27 22:10:25
---

> Github https://github.com/pardom/ActiveAndroid
  官网 http://www.activeandroid.com/
  
<!--more-->

###简单介绍


- 什么是客户端开发
> 我所理解的客户端开发，就是将数据以各种各样的形式展现出来。当然也会对数据做一些简单的处理。这避免不于数据库的交互，
而在Android上做数据库交互是非常麻烦的事情。所以就需用一下ORM库来解决这些问题。
- 什么是ORM
> 数据对象模型，顾名思义。就是对象和关系型数据之间的转换，避免了写SQL语句
- ActiveAndroid 
> 没有什么可说的，就两个字“简单”，使用的是反射


###具体使用（三步长拳）
- 第一步
>在AndroidManifest.xml中添加两个配置
`<meta-data android:name="AA_DB_NAME" android:value="mydata.db"/\>`
数据库名
`<meta-data android:name="AA_DB_VERSION" android:value="1"/\>`
数据库版本号，用于数据升级

- 第二步
>继承`com.activeandroid.app.Application`

<!--java-->

	public class MyApplication extends Application {
	}

	<application android:name=".app.UimApplication" ...

如果无法继承`com.activeandroid.app.Application`也可以

<!--java-->
	
	public class MyApplication extends SomeLibraryApplication {
		@Override
		public void onCreate() {
		    super.onCreate();
		    ActiveAndroid.initialize(this);
		}
		@Override
		public void onTerminate() {
		    super.onTerminate();
		    ActiveAndroid.dispose();
		}
	}

- 第三步
>创建表

<!--java-->

	@Table(name = "Userinfo")
	public class Userinfo extends Model {
	    @Column(name = "Name")
	    public String name;

	    @Column(name = "passWord")
	    public String passWord;
	}

>打完收工

###数据库升级
- AndroidManifest.xml中数据库版本号AA_DB_VERSION（必须比上一版本号大的正整数）
- 在assest目录里面创建sql文件，目录结构（/migrations/升级后的版本号.sql），文件里面你需要写上你变动数据库的sql语句（一行一句sql语句）

###源码解读
- 表生成
>应用在启动的时候通过反射将所有的表对象加载到内存，在onCreate的时候创建所有的表

- 增删改查的实现
>通过字符串拼接转换成查询语句进行查询

- 升级
>取出assets/migrations 文件夹中所有的.sql文件。对版本号进行匹配。


###中间人攻击神器 mitmproxy
- 安装
	- sudo apt-get install mitmproxy
- 使用
	1、在.mitmproxy下有个mitmproxy-ca-cert.cer发送到手机上，
	2、手机上安装证书
	3、添加代理
	4、输入命令mitmproxy