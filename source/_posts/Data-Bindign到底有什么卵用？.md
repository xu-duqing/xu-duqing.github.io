title: Data-Bindign到底有什么用？
date: 2015-08-07 22:44:48
tags: 
	- Android
	- data binding
	- MVVM
---

[上一章](/2015/08/04/android-data-binding-技术介绍-1/)介绍了Data Binding是如何使用的。那么我们不经要问，这个到底有什么用？引入了一堆包编译那么慢，难道就为了少写一点`findViewById()`。而且布局文件本身就已经很乱了，在嵌入一堆的逻辑代码。真的好吗？真 的 很 好

<!--more-->
### 更少的冗余代码
做Android开发的应该都有感触，一个并不复杂的Activity中往往有着大量无意义的界面代码，为了少些那种代码经常要引入`ButterKnife`、`annotation`等库。通过注解获得View。当时即使是这样，Activity也无法专心的做逻辑处理的事情。View的控制代码还是占了很大的篇幅。

Data Binding就极大程度的解决了这个问题，大部分的View操作都可以在布局文件中完成。Activity几乎不需要持有View对象，这一点大家简单使用后就能感觉到。它还有一个更大的用处，解决的Android的测试大难。

### 为什么Android单元测试很难做
Android开发人员中不知有多少人在做单元测试？我们团队正试图在做，费劲力气解决掉各种环境问题之后发现无从下手。开始怀疑是不是姿势不对，于是开始各种Google然而并没有正确的姿势。然后就开始怀疑人生肯定是自己的功力不够。这个真不完全是，这次真是武器属性不够。要知道即使是Google推荐的开发模板项目也是无法进行单元测试的啊。我们从一开始写Android代码的时候所了解到的方法就是在Activity中完成UI及大部分的逻辑。使得我们的代码根本不满足测试的三个条件： 准备，测试，断言。有个老外对对这一块做了详细的分析，[分析 Android 难于进行单元测试的原因](http://blog.csdn.net/column/details/whyunittesthard.html)他在文章中对Android的框架做了大量的吐槽。

终于，Google推出了Data Binding。他将UI层很好的剥离出来，举个栗子：

需要测试代码。

```

	public class MainActivity extends AppCompatActivity {

	    public User user;
	    @Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        ActivityMainBinding binding = DataBindingUtil.setContentView(this,R.layout.activity_main);

	        binding.setUserName("guang");
	        user = new User();
	        user.setName("村上春树");
	        user.setAge("66");
	        user.setIsAdult(true);
	        binding.setUser(user);
	        binding.setMoney(1230000);
	    }

	    public void onClick(View view){
	        user.setName("TF boys");
	        user.setAge("18");
	        user.setIsAdult(false);
	    }
	}

```

测试代码

```

	@RunWith(RobolectricGradleTestRunner.class)
	@Config(constants = BuildConfig.class)
	public class MainTest {

	    @Test
	    public void onClickTest(){
	        MainActivity activity = Robolectric.setupActivity(MainActivity.class);
	        activity.onClick(null);

	        assertThat(activity.user.getAge().equals("18")).isTrue();
	    }
	}
```

END 
