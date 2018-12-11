title: android ORM 框架ActiveAndroid介绍
tag:
	-ORM
	-Android
date: 2014-11-26 16:02:00
---
最近在做新项目的时候用到的ActiveAndroid。简单介绍一下使用方法，不做深入理解算是一个入门文档吧。
ORM框架也用过一些，这个是用起来最简单的，具体的效率数据量太小看不出来。不过这个多人在用应该也不会有大的影响吧
<!--more-->

###第一步
在AndroidManifest.xml中添加两个配置
>`<meta-data android:name="AA_DB_NAME" android:value="mydata.db"/\>`
数据库名
`<meta-data android:name="AA_DB_VERSION" android:value="1"/\>`
数据库版本号，用于数据升级

###第二步
继承`com.activeandroid.app.Application`

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

###第三步
创建表
<!--java-->

	@Table(name = "Userinfo")
	public class Userinfo extends Model {
	    @Column(name = "Name")
	    public String name;

	    @Column(name = "passWord")
	    public String passWord;
	}


###OK 现在开始就可以对数据进行增删改查了

增：
<!--java-->

	Userinfo userinfo = new Userinfo();
    userinfo.name = "sam Xu";
    userinfo.passWord="123456";
    userinfo.save();

删：
<!--java-->

	Userinfo userinfo = Userinfo.load(Userinfo.class, 1);
	userinfo.delete();

	Userinfo.delete(Userinfo.class, 1);

	new Delete().from(Userinfo.class).Where("name = ?","samxu").execute();

改：
<!--java-->

	Userinfo info = Userinfo.load(Userinfo.class,1);
    info.name = "samxu";
    info.save();

查：
<!--java-->
	
	new Select().from(Userinfo.class).Where("name = ?","samxu").executeSingle();

###更多语句自己去查接口吧！	
