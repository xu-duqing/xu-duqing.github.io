---
title: git 条件配置
date: 2018-12-12
tags:
	- git
---

## 多 git 账户

很多公司都在使用 git 作为开发的代码仓库，如果正好你还有 `github` 的账户的话就有两个账号了，通常我们都会生成两个 `ssh` 密钥来区分工作和 `github`

`~/.ssh/config`

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/personal_key
Host gitlab.com-work
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/work_key
```

## 条件配置


`~/.gitconfig`

```
[includeIf "gitdir:~/work/"]
  path = .gitconfig-work
[includeIf "gitdir:~/play/"]
  path = .gitconfig-play
```

```
$ cat ~/.gitconfig-work
[user]
name = Serious Q. Programmer
email = serious.programmer@business.example.com

$ cat ~/.gitconfig-play
[user]
name = Random J. Hacker
email = rmsfan1979@example.com
```

参考文档: [Conditional configuration](https://blog.github.com/2017-05-10-git-2-13-has-been-released/#conditional-configuration)