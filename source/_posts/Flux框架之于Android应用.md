title: Flux框架之于Android应用
date: 2015-09-7 22:44:48
tags: 
	- Android
	- Flux
	- 框架
	- 单元测试
---

上次分享也吐槽了Android之于单元测试的困难重重，原因也就不多说了详见[Android 进行单元测试难在哪](http://blog.csdn.net/column/details/whyunittesthard.html)。Flux是前端的一个基于数据流的框架，做到层于层之间很好的分离。基于这个思想在Android做了验证，很好的支持了单元测试。

<!--more-->

### 每一个应用都应该有一个架构
之前写代码的时候很少考虑架构这一块，一切都是围着需求去做。实现这个业务需要几个API、几张表、几个activity。然后吭哧吭哧就做了。其实一直觉得这样的开发很好，快速有效嘛。后来随着项目越来越大，发现有点不对事儿。代码难看不说，模块相互牵扯难以阅读调试，单元测试更是无法去写。
在网上找了一些重构的资料补补短，发现应用分两种，设计出来和生长出来的。请对比下图理解。
![城市规划](http://ww4.sinaimg.cn/mw690/75a33d61gw1evxps7qv0nj20hs054wg9.jpg)
很难说魔都这个城市是合理的或者美的是吧。

### 前端开发框架Flux
这好像是最近比较火的前端开发框架，也是facebook搞出来的一套东西。然后看到有人将这套东西移植到Android用的还挺好。于是了解了一下！

![Flux](http://static.oschina.net/uploads/space/2015/0417/094037_Jc87_1035386.png)

其实Flux架构的核心在于数据，就是一个数据的流动解决方案。看上去挺简单的，正好消息中心面临改版，月饼节那两天在家就合计着在项目上将这一套架构实现了。

### 移植到消息中心

#### 1、Flux是基于通知的。它先把一条数据的生命周期定义成不同的层。层于层之间通过Action解耦。所以首先我要引人EventBus。  

```

	dependencies {
	    compile fileTree(dir: 'libs', include: ['*.jar'])
	    compile 'de.greenrobot:eventbus:2.4.0'

	    //TEST COMPILE
	    testCompile "junit:junit:4.12"
	    testCompile "org.assertj:assertj-core:1.7.0"
	    testCompile('org.robolectric:robolectric:3.0-rc2')
	}
```

#### 2、 定义Action。传递事件和内容的媒介。我们这样定义

```

	public class Action {

	    private final String type;

	    private final Object data;

	    public Action(String type, Object data) {
	        this.type = type;
	        this.data = data;
	    }

	    public String getType() {
	        return type;
	    }

	    public Object getData() {
	        return data;
	    }

	    @Override
	    public String toString() {
	        return "Action{" +
	                "type='" + type + '\'' +
	                ", data=" + data +
	                '}';
	    }
	}
```

#### 3、定义Dispatcher 做任务分发

```

	public class Dispatcher {

	    private static Dispatcher instance;
	    private final EventBus mEventBus;

	    protected Dispatcher(){
	        this.mEventBus = new EventBus();
	    }

	    public static Dispatcher getInstance(){
	        if (instance == null){
	            instance = new Dispatcher();
	        }

	        return instance;
	    }

	    public void despatcher(String type,Object data){
	        mEventBus.post(new Action(type,data));
	    }
	    public void emitChange(Store.StoreChangeEvent o){
	        mEventBus.post(o);
	    }

	    public void error(String errorMessage){
	        mEventBus.post(new ErrorEvent(errorMessage));
	    }

	    public void register(Object subscriber){
	        mEventBus.register(subscriber);
	    }

	    public void unregister(Object subscriber){
	        mEventBus.unregister(subscriber);
	    }
	}
```

#### 4、定义Store 做状态保持以及业务逻辑

```

	public class StoreMessageList extends Store{

	    public StoreMessageList(Dispatcher dispatcher) {
	        super(dispatcher);
	    }

	    public void onEvent(Action action){
	    	//事件处理
	    }
	 }   
```

### 可测的Android代码
我的理解就是将业务逻辑完全的独立出来。一条数据从WebApi获取到之后，经过存储、读取、业务处理、展示。这是一个完整的生命周期。而这个过程中只有业务处理是复杂多变的，也只有这个过程才是有必要做单元测试的。 而这个架构正好做到了按照数据的生命周期分层，层于层之间通过EventBus解耦。是的store这个模块非常易于测试。

当然Flux的简单，易理解，易实现也是特点之一。以上都是个人的一切浅见，大家有时间也看看，有什么不同的见解多多交流。

