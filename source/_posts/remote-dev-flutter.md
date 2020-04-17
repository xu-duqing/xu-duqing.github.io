title: 远程开发 Flutter
tag:
	-Tools
	-Flutter
date: 2020-4-17 14:02:00
---

阻碍你开始开发 Flutter 的原因是什么?

`FLutter` 作为跨平台开发框架可以运行在不同的设备上,  和 RN 一样这种跨平台方案并不能像我们想象的一样只需要一个开发者就能干掉两端的事情, 相反可能因此还多增加了一个开发者.  因为我们依然需要端相关的知识.  就像 FLutter 的环境部署包括三个部分一样

- Flutter 开发环境 
- Android 开发环境 
- iOS 开发环境.

### Flutter 环境配置
以 macOS 为例 [macOS install  - Flutter](https://flutter.dev/docs/get-started/install/macos)

作为一个 Android 开发者, 我想提醒各位. 安装上面的环境之前请确认一下自己是否有足够的空间?  Android SDK / 模拟器 / 编译存储 是需要非常大的空间.

而这, 是不是阻碍你开始开发 Flutter 的原因了?

### 一个一劳永逸的想法
- 希望团队开发环境只需要搭建一次
- 希望使用的版本能保持一致
- 希望体验简单的像个孩子

我只想简单的做一个 Coder , 上次有这个想法的时候就被 RN 狠狠的打了脸: “不, 你不想” 

直到我看到 [VS Remote Development] (https://code.visualstudio.com/docs/remote/remote-overview) 完美的契合了我的希望

### VS Remote Development
- 开发环境收敛到一个系统中, 使用更加专业的机器
- 开发环境沙箱化, 不影响本地配置
- 容易上手并且保证环境统一
- 远程调试生产问题

### 支持三种远程方式
- Remote-SSH : 通过 SSH 连接到服务器进行开发
- Remote-Containers : 以容器作为服务器开发
- Remote- WSL :  windows 上用的,  没有用过

### 远程开发方案踩坑
- Remote-Containers ❌ 
    -  `VS Local -> Flutter Containers  -> USB Device`
	- Docker for Mac VM 不支持设备映射
- Remote-SSH ❌ :   
    - `VS Local -> VS Server`
	- 无法看到执行结果
- Remote-SSH + STF  ✅ :
    - `VS Local -> VS Server -> STF Server -> Local Browser`

### 如何使用
1. 部署服务器 (Flutter 开发环境 略)
2. 本地 VS Code 安装插件, `Remote SSH (Nightly)`  (注意 Remote SSH 不支持使用 Mac 作为服务器)
3. 配置 ssh 免密登录: `ssh-copy-id -i ~/.ssh/id_rsa.pub appweb@IP`
4. 配置别名登录: `vim ~/.ssh/config`

```shell
Host development
    Hostname IP
    Port 22
    User appweb
    IdentityFile ~/.ssh/id_rsa
```

5. 按 `F1`  选择 `Remote-ssh: Connect to Host` 选择 `development` 
6. 选择你需要开发的目录
7. 打开 `Terminal`  执行 `flutter create xxx`
8. 打开 `STF` 获取你希望调试的设备
9. 执行 `adb connect IP:端口`
10. 执行 `flutter run` 或  `F5` (需要安装 Flutter&Dart 扩展)
11. 开始你的表演 :+1: 

:注 我部署了一台可以供大家开发体验

### 参考资料
- [设备农场](https://www.daguang.me/2020/04/01/install-stf-for-mac/)
- [macOS install  - Flutter](https://flutter.dev/docs/get-started/install/macos)
- [VS Remote Development] (https://code.visualstudio.com/docs/remote/remote-overview)
