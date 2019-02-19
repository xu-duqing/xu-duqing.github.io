title: GitHub 配置代理
tag:
	-git
date: 2019-2-19 17:22:00
---

19 年第一天上班就遇到 `github` 被墙, web 访问还好解决将 github.com 加入白名单就可以. 但是仓库走的是不同的协议,所以无法通过白名单进行代理.

## 解决方案

- `ShadowsocksX-NG` 
- `Git` 代理


GitHub 当前支持两种协议进行请求,

一般我们是使用 ssh 协议. 

部分以 github 作为数据源的项目会使用 http / https 作为访问协议比如 CocoaPods

## 配置 http 协议

### 设置 Git 全局代理

```
git config --global http.proxy 'socks5://127.0.0.1:1086'
git config --global https.proxy 'socks5://127.0.0.1:1086'
```

但是这种全局代理会导致所有的 http 协议的 git 请求都走代理, 可能会影响你其他项目.可以参考[多 git 账户](https://www.daguang.me/2018/12/12/git-config-conditional/)的配置方式进行配置

### 移除代理

```
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 配置 ssh 协议

修改 `~/.ssh/config` 文件 (不存在就新建一个)

```
Host github.com
  HostName github.com
  User git
  # 走 socks5 代理
  ProxyCommand nc -v -x 127.0.0.1:1086 %h %p
```
