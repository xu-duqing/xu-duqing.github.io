title: Android UT 中加载资源
tag: 
	-Android
	-UT
date: 2018-12-20 20:50:25
---

先挖个坑，19 年计划写一个关于 Android 单元测试的专栏。

在写 case 的时候有很多的场景需要加载资源，比如通过文件存储 mock 数据，验证文件的加载过程。

### 添加资源目录

`src/test/resources/test.json`

测试文件应该放在 `src/test` 目录避免影响源码

### 加载文件

`classLoader.getResource("test.json")`

``` java
private static File getFileFromPath(Object obj, String fileName) {
    ClassLoader classLoader = obj.getClass().getClassLoader();
    URL resource = classLoader.getResource(fileName);
    return new File(resource.getPath());
}
```