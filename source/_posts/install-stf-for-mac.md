title: 在 Mac 上安装手机农场(stf)  
tag:
	-Tools
	-Android
date: 2020-4-1 14:02:00
---

由于手机的不断更新, 公司为了做兼容性测试这几年来以及买了上百台手机.但是分散在各个开发和测试的手上, 另外还有一大批放在机房. 开发做兼容性开发的时候需要相互借用,非常不方便. 所以测试比较喜欢用 Testin . 每年在 Testin 上花的钱都有十多万, 于是想要不我们团队做一个类似 Testin 的业务于是做了简单的市场调研.

- 各大公司都有做自己的设备农场: 小米 / 阿里 ...
- 亚马逊和 Google 也提供了类似的平台
- 亚马逊 : https://aws.amazon.com/device-farm/
- Google : https://firebase.google.com/docs/test-lab
- 一些三方的供应商: 如 Testin
- 开源方案:
 - stf (Smartphone Test Farm) https://github.com/openstf/stf
 - 网易 atxserver2 https://github.com/openatx/atxserver2

看了下开源方案 stf 比较适合我们公司, 于是决定在公司内部部署一套试一试

### 主要功能

- 远程手机控制和屏幕实时显示
- 设备日志查看、过滤
- 远程调试
- 执行shell命令
- 提供详细的设备信息，通过电话号码，IMEI，ICCID，Android版本，运营商，产品名称和/或许多其他属性搜索设备
- 截图、复制粘贴、拖动到浏览器安装apk、设备文件管理等
- 简单的REST API


### 主要模块
- DB : rethinkdb
- STF Server 
- STFService.apk

### STF Docker

这个相对比较简单没有哪些环境问题, 但是这个只适合只 Linux 上. 因为在 Mac 上的 Docker 是阉割版本的 VM 无法访问硬件, 自然无法安装 adb server 虽然可以通过 virtualbox 进行乔接也是非常麻烦的.  相关 issue : https://github.com/sorccu/docker-adb/issues/8

1. 启动数据库

`docker run -d --name rethinkdb -v /srv/rethinkdb:/data --net host rethinkdb rethinkdb --bind all --cache-size 8192 --http-port 8090`

2. 启动 adb server

`docker run -d --name adbd --privileged -v /dev/bus/usb:/dev/bus/usb --net host sorccu/adb:latest`

3. 启动 server

`docker run -d --name stf --net host openstf/stf stf local --public-ip 192.168.1.100`

### For Mac

我们团队维护的服务器只有几台垃圾桶 (MacPro) 性能虽然好但是局限 Mac 中 Docker 的局限性, 只能选择通过 npm 安装

#### 系统要求

- macOS
- node: `v8.9.2`
- npm: `5.5.1`

> 注意这个 node 版本号, 一定要是这个版本其他版本都不兼容, 官方也没有解决这个问题只是建议使用 8.x 但是我试过其他的版本发现只有这个版本可以


1. 安装 rethinkdb

`brew install rethinkdb graphicsmagick zeromq protobuf yasm pkg-config`

2. 安装 stf

`npm install -g stf`

3. 安装 pm2

`npm i -g pm2`

4. 启动服务

`pm2 start rethinkdb --interpreter none -- --bind all --cache-size 8192 --http-port 8090`

`pm2 start stf --interpreter none -- local --public-ip=192.168.1.2`

`pm2 ls` 查看服务状态

5. 配置 pm2 自启动

```
pm2 startup
pm2 save
```

### 上传文件包含中文崩溃

这个 BUG 我已经修复并合并进去了 https://github.com/openstf/stf/pull/1204 但是还没有发布新版本, 所以大家遇到还是要自己改一下

参考这个改动就可以: [Bugfix: chinese characters donot support](https://github.com/openstf/stf/pull/1204/files/b078336dd2acb932c2e1e8d21fc9998199917746)


### 一些机型容易掉线问题
- 魅族: 需要关闭 Flyme 支付保护, 开启 USB 调试
- 小米: 需要开启 USB 调试 (需要手机卡 , 并且登录小米账号才能设置)
- 所以机型都需要给 STFServer.apk 所有权限

![](/images/stf.jpg)