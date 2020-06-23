title: 如何检查 Android 应用的接口调用
tag:
    -Android
    -Xposed
date: 2020-6-24 1:02:00
---

这是一个有趣的话题, 来自之前的一个隐私合规项目. 我们被点名说获取了用户的 Applist 事实上这是一个三方库为了做链接共享所使用的 . 我们根本不知道这件事请, 就很好奇的是他们是怎么发现的 ?  

市面上普遍的办法是通过扫描 Manifest 获取申请的权限列表, 比如我们在安装包的时候提示该应用申请了那些权限. 但是 AppList 接口`getInstalledPackages` 根本就不需要申请任何权限. 所以我们就猜测可能是做了代码扫描或者在他们的 ROM 里面加了这个接口的埋点一旦调用就触发上报

我们的想法是无论如何不能让这种包发到线上. 必须想办法把这种接口调用找出来. 现在觉得这个方式不仅仅能解决隐私权限问题. 等于是开了天眼可以根据规则发现应用中所有的问题, 漏洞 / 风险接口 / 错误定义 ... 所以今天把之前的方案整理出来给以后的项目参考

以 Applist 这个接口为例, 如果要找到他可以从两个维度进行 “编译期”  /  “运行时” 维度不一样目的也不一样

- 编译期的目的是看看有没有使用, 使用静态检查
- 运行时的目的是看看什么时候使用, 使用动态检查

## 静态检查
因为 Android 的 SDK 都是经过编译的, 所以静态检查的核心是如何读懂那些字节码找到你想找的信息. 我们使用的方式是先通过 `Javap` 讲字节码反编译出来, 通过注释能看到接口调用

```
  private static java.lang.String getDeviceID(android.content.Context);
    Code:
       0: aload_0
       1: ifnonnull     7
       4: ldc           #25                 // String
       6: areturn
       7: aload_0
       8: ldc           #46                 // String phone
      10: invokevirtual #4                  // Method android/content/Context.getSystemService:(Ljava/lang/String;)Ljava/lang/Object;
      13: checkcast     #47                 // class android/telephony/TelephonyManager
      16: astore_1
      17: aload_1
      18: invokevirtual #48                 // Method android/telephony/TelephonyManager.getDeviceId:()Ljava/lang/String;
      21: astore_2
      22: aload_2
      23: invokestatic  #49                 // Method checkDeviceId:(Ljava/lang/String;)Z
      26: ifeq          31
      29: aload_2
      30: areturn
      31: goto          35
      34: astore_1
      35: getstatic     #51                 // Field android/os/Build$VERSION.SDK_INT:I
      38: bipush        9
      40: if_icmplt     47
      43: getstatic     #52                 // Field android/os/Build.SERIAL:Ljava/lang/String;
      46: areturn
      47: invokestatic  #53                 // Method generateUUID:()Ljava/lang/String;
      50: areturn
    Exception table:
       from    to  target type
           7    30    34   Class java/lang/Exception
```

Jar 包反编译脚本:

`javap -cp “+path+” -c -p $(jar -tf “+path+” | grep class | sed ’s/.class//g’)`

Class 目录反编译脚本:

`javap -cp ./ -c -p $(find . | grep class | sed ’s/.class//g’)`


至于如何获取 jar 包或者 class 文件可以根据项目需求, 可以通过 `dex2jar` 获得也可以通过  Transform API

![](https://this-is-my-images.oss-cn-beijing.aliyuncs.com/16a81c75654cdf2c)


```
+-----+  dex2jar   +-----+  javap   +------+
| APK | ---------> | jar | -------> | code |
+-----+            +-----+          +------+
```


接下来就是如何获取那些涉及授权的接口列表了, 由于 Android Framwork 在每个版本的定义都不一样, 所以需要选择一个通用的集合或者全集. 已经有大佬把各个系统的接口都找出来了可以直接用 https://github.com/zyrikby/PScout


该方案最大的问题就是反编译的过程非常的慢, 严重拖累了编译速度建议开个线程池处理

![](https://this-is-my-images.oss-cn-beijing.aliyuncs.com/img/企业微信截图_0fafe9e5-abb5-4b27-9d6e-5e848d3355ad.png)

## 动态检查
静态检查只是知道了有这段代码, 但是有没有用到什么时候用到还是不知道. 比如很多接口只是在启动那一刻调用才特别敏感, 其他阶段调用其实是有合理的场景的, 比如位置信息在确实使用地图的那一刻调用其实是没有问题的, 但是一启动就要拿就很不合理

动态检查就是要做应用运行时获取相关接口的调用时机以及堆栈信息.  想要做到这一点, Android 的开发同学很容易想到 Xposed . 该框架通过替换系统的 **zygote** 进程实现了系统接口的 Hook . 只需要使用它提供出来的 API 就能轻松的实现运行时的  AOP Hook .

但是事实上该功能需要做 Root 手机上才能进行, 于是我们选择了 [ecip](https://github.com/tiann/epic) 库它可以在非 Root 场景下实现 Hook 

1. 将所有要观察的 API 注册到 Xposed
2. 捕获到调用现场并保存相关的截图 / 堆栈信息

但是要注意的是该框架的兼容性还是有很大的问题, 很多接口都注册不上. 而且很多异常还无法捕获, 所以不能用到生产环境




