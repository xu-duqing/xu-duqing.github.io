layout: android
title: android-data-binding-技术介绍-1
date: 2015-08-04 21:38:53
tag: 
	- Android
	- data binding
	- MVVM
---
[上一章](/2015/08/01/android-data-binding-技术介绍-0/)我们简单了解了一下MVVM框架，这一章具体了解一下MVVM在Android中运用 DataBinding。

<!--more-->

### 1、配置环境
在项目的gradle中配置如下：
<!--lang:java-->
	
	dependencies {
        classpath 'com.android.tools.build:gradle:1.2.3'
        classpath 'com.android.databinding:dataBinder:1.0-rc0'
    }

在需要使用Data Binding的module中添加插件：
<!--lang:java-->
	
	apply plugin: ‘com.android.application'
	apply plugin: 'com.android.databinding'
该插件会在项目中添加编译必要的依赖包。

### 2、Data Binding Layout 文件
Data Binding layout文件有点不同的是：起始根标签是 layout，接下来一个 data 元素以及一个 view 的根元素。这个 view 元素就是你没有使用Data Binding的layout文件的根元素。举例说明如下：
<!--lang:xml-->

	<layout  xmlns:android="http://schemas.android.com/apk/res/android">
	    <data>
	        <variable name="userName" type="String"/>
	    </data>
		<RelativeLayout
		    android:layout_width="match_parent"
		    android:layout_height="match_parent">

		    <TextView 
		    	android:text="@{userName}" 
		    	android:layout_width="wrap_content"
		        android:layout_height="wrap_content" />

		</RelativeLayout>
	</layout>


> 1. 定义了一个String类型的变量userName。
2. @{userName} 指的是将这个TextView的内容和userName绑定起来

### activity中的使用

添加完`<data>`标签后，`build.gradle`中配置的插件`com.android.databinding` 就会更具xml的名称生成一个继承自`ViewDataBinding`的类。例如:`activity_main.xml`就会生成`ActivityMainBinding`

> 
1. 修改`setContentView()`替换成`DataBindingUtil.setContentView()`。他会返回当前的Data Binding。
2. 对xml中定义的变量进行赋值 `binding.setUserName("guang");`

<!--lang:java-->

	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActivityMainBinding binding = DataBindingUtil.setContentView(this,R.layout.activity_main);
        binding.setUserName("guang");
    }

这样我们就完成一个简单数据绑定。

### `<data>`标签

1、刚刚了解到，插件`com.android.databinding`会自动根据xml的名称生成`ActivityMainBinding`，也可以自定义类名
<!--lang:xml-->
	
	<data class="com.example.CustomBinding">
	</data>

2、标签下的两个重要元素的意思。
<!--lang:xml-->

	<data>
        <import type="com.sam.databinding.data.User"/>
        <variable name="userName" type="String"/>
        <variable name="user" type="User"/>
    </data>

`<import>` 就和JAVA文件中的import关键字意义一样，用于引用需要用到的包名或者类名
`<variable>` 定义变量， `name`是变量名`type`是变量类型


注意
> java.lang.* 包中的类会被自动导入，可以直接使用

### 一些高级用法
#### 1、支持在xml中调用类方法

<!--lang:java-->

	public class StrUtils {

	    public static String FEN2YUAN(long money){
	        return String.valueOf(money/100);
	    }
	}


<!--lang:xml-->
	
	<layout  xmlns:android="http://schemas.android.com/apk/res/android">
	    <data>
	        <import type="com.sam.databinding.utils.StrUtils"/>
	        <variable name="money" type="long"/>
	    </data>
		<LinearLayout
		    android:layout_width="match_parent"
		    android:layout_height="match_parent"
		    android:orientation="vertical"
		    >
		    <TextView
		        android:layout_width="wrap_content"
		        android:layout_height="wrap_content"
		        android:text="@{StrUtils.FEN2YUAN(money)}"/>
		</LinearLayout>
	</layout>

#### 2、支持三目运算符

<!--lang:xml-->

	<layout  xmlns:android="http://schemas.android.com/apk/res/android">
	    <data>
	        <import type="com.sam.databinding.data.User"/>
	        <import type="android.view.View"/>
	    </data>
	    <LinearLayout
	        android:layout_width="match_parent"
	        android:layout_height="match_parent"
	        android:orientation="vertical"
	        > 
	        <TextView
	            android:layout_width="wrap_content"
	            android:layout_height="wrap_content"
	            android:visibility="@{user.adult ? View.VISIBLE : View.GONE}"
	            android:text="@{user.name}"/>
	    </LinearLayout>
	</layout>


#### 3、Null Coalescing 运算符
`android:text="@{user.firstName ?? user.lastName}"`
等价于
`android:text="@{user.firstName == null ? user.lastName:user.firstName }"`

#### 4、类别名
如果有两个名称相同的类，要如何使用？
<!--lang:xml-->
	
	<data>
		<import type="com.sam.databinding.data.User"/>
        <import type="com.sam.databinding.bind.User"/>
	</data>

这里需要使用别名，如：
<!--lang:xml-->

	<data>
		<import type="com.sam.databinding.data.User"/>
        <import type="com.sam.databinding.bind.User" alias="bindUser"/>
        <variable name="user" type="bindUser"/>
	</data>


#### 5、使用资源数据
`android:padding="@{large? (int)@dimen/largePadding : (int)@dimen/smallPadding}"`

这个官方文档中有个BUG，详见[http://blog.csdn.net/feelang/article/details/46342699](http://blog.csdn.net/feelang/article/details/46342699)

#### 6、获取View对象
使用这套框架，基本上不需要在Activity中获取View了。但是也有很多特别的情况是需要获得到View对象的，那么也很简单。只需要对View定义一个ID。
<!--lang:xml-->

	<TextView
        android:id="@+id/showMoney"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"

这样Data Binding就是更具ID生成一个对应的变量，可以直接从Data Binding对象中获得
<!--lang:java-->

	ActivityMainBinding binding = DataBindingUtil.setContentView(this,R.layout.activity_main);
    TextView tvShowMoney = binding.showMoney;

### Observable Binding
前面已经介绍了xml中元素的一些用法。但也仅仅只是生成一些中间代码。简化了对View的操作。并没有做到上一章提到的双向绑定实现MVVM结构。我们想要的是不操作View，只是改变View绑定的对象，就实现View内容的更新。反之View变化绑定对象也随之更新。不要着急且听我慢慢道来。首先，第二种Google还没有提供，暂时只能支持单向绑定，那么怎么做了。有以下几种方式

#### 1、定义数据对象继承BaseObservable
<!--lang:java-->

	private static class User extends BaseObservable {
	   private String firstName;
	   private String lastName;
	   @Bindable
	   public String getFirstName() {
	       return this.firstName;
	   }
	   @Bindable
	   public String getLastName() {
	       return this.lastName;
	   }
	   public void setFirstName(String firstName) {
	       this.firstName = firstName;
	       notifyPropertyChanged(BR.firstName);
	   }
	   public void setLastName(String lastName) {
	       this.lastName = lastName;
	       notifyPropertyChanged(BR.lastName);
	   }
	}

其中，`BR`就相当于`R.java`，是编译期生成的对象。保存了用`@Bindable`标记过的方法的ID。通过`notifyPropertyChanged(BR.lastName);`可以看出是set数据后会调用`notifyPropertyChanged`通知绑定了该对象的View更新；

#### 2、使用`ObservableField`
<!--lang:java-->

	private static class User {
	   public final ObservableField<String> firstName = new ObservableField<>();
	   public final ObservableField<String> lastName = new ObservableField<>();
	}

看下他的源码其实很简单，就是将对象用Observable包了一层
<!--lang:java-->

	public class ObservableField<T> extends BaseObservable {
	    private T mValue;

	    public ObservableField() {
	    }

	    public T get() {
	        return this.mValue;
	    }

	    public void set(T value) {
	        this.mValue = value;
	        this.notifyChange();
	    }
	}

### 3、使用定义好了的一些基础类

<!--lang:java-->

	private static class User {
	   public final ObservableInt age = new ObservableInt();
	}
定义好的有`ObservableByte`、`ObservableInt`、`ObservableChar`、`ObservableBoolean`、`ObservableDouble`、`ObservableFloat`、`ObservableShort`、`ObservableLong`

这样我们就完成了数据的绑定， 当我们在activity中改变这个状态的时候。View也会相应的更新。

OK，Data Binding的使用就介绍到这里，还有很多使用技巧我也没法一一举出。具体可以去[Data Binding Guide](https://developer.android.com/tools/data-binding/guide.html)了解。

接下来我要说说，为什么要使用Data Binding。难道就是为了少写`findViewById()`? Data Binding到底有什么乱用，敬请关注第三节[Data Bindign到底有卵用？](/2015/08/04/Data-Bindign到底有什么卵用？/)




