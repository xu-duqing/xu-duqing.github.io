title: 如何用 Node 开发命令行工具
tag:
	-Tools
	-cli
date: 2020-8-31 14:02:00
---

命令行 CLI (Command Line Interface) 可以说是一种比较古老的交互方式, 在图形化交互兴起之后它便迅速的淡出了人们的视线. 以至于我老婆问过我这个黑框为什么这么黑? 黑客是不是就用这个?

而在这个世界的那一边, 由于其有着无法比拟的简洁 / 高效 / 丰富性被一群程序员们却将此奉为至高无上的工具.  并且几乎离不开它, 这也是我们喜欢用 Mac 开发的原因, 他的终端体验真的很好

命令行工具的开发其实比较简单, 今天主要介绍一下命令行工具的设计原则和一些好用库

<!--more-->

## 命令行工具的设计原则
由于其简洁的输入输出交互特点, 没有图形交互那样有着非常丰富的元素给予用户提示. 所以在设计上的很多原则是我们需要遵守的.

### 命令的组织结构
第一条也是最重要的一条, 严格遵循标准的命令行的组织结构.  几乎常用的命令行都是使用下面的方式进行组织的, 有一些变体比如增加一些子命令等. 但是基本上都是按照这个规范设计的.  

`$[cmd] [action] [--args]`

- cmd : 命令入口可以是完整命令, 也可以是简写命令
- action:  指定需要完成的任务, 一般不使用简写
- args: 完成任务所需要的参数
	- 支持多个
	- 完整参数名使用 `--` 表示 如 `mozi create --templet func`
	- 缩略参数名使用 `-` 表示 如 `mozi create -t func`

违反这一原则的 CLI 是令人崩溃的. 用户上手会变得困难而且用户习惯之后用其他命令也会觉得困难

### 丰富的帮助
`$[cmd] -h / --help`

当一个 CLI 安装完成之后 `help`一定是用户最先使用的命令.  CLI 的交互方式使得用户特别依赖 `help`所以一个丰富强大的使用帮助变得非常重要. 

```
用法: mozi <命令> [参数] [选项]

命令：
  mozi create   初始化一个 faas 项目
  mozi version  发布版本
  mozi deploy   部署版本

选项：
  -h, --help     显示帮助信息                                             [布尔]
  -v, --version  显示版本号                                               [布尔]

示例：
  mozi create --templet func
```


当然如果有必要的话最好给每个 action 或者 subcommand 都提供一个帮助信息如:

```
➜  ~ mozi create -h
用法: mozi create --templet [选项]

选项：
  -t, --templet  选择需要创建的模板
  -h, --help     显示帮助信息                                             [布尔]
  -v, --version  显示版本号                                               [布尔]

示例：
  mozi create --templet func
```


处理标准输出的帮助信息之外还应该建立完善的帮助文档,  以及安装后的引导设计, 这些都是可以降低用户上手难度解决使用问题的.

### 详细的错误处理
和帮助信息一样错误处理也是为了解决用户在使用上的问题, 错误消息应该尽可能的给出原因和解决办法. 信息应该服务用户的语言习惯避免理解成本及理解歧义

### 足够好看
CLI 给人的感觉就和好看没有关系, 就 ASCII 码的输入输出怎么能做的很好看了?

答案是可以的, 首先 ASCII 支持定义颜色 [ANSI escape code - Wikipedia](https://en.wikipedia.org/wiki/ANSI_escape_code) 可以从色彩上丰富交互

其次是可以使用一些 [Emoji ](https://emoji.muan.co/) , 这样看起来有点炫酷了

![](https://this-is-my-images.oss-cn-beijing.aliyuncs.com/img/20200824153252.png)

以及还有很多的 ASCII 表达方式如, 选择 / 表格 / 加载动画等等都是可以让你的 CLI 有趣生动起来

### 简少输入
虽然 CLI 是输入输出的交互,  但是用户输入一定不是最好的选择,毕竟记住一长串的字符本身就不简单. 所以我们应该尽可能的让用户少输入

第一个办法就是使用别名:

`mozi create --templet func`

`mz create -t func`

虽然上面的命令并没有减少多少字符, 但是却极大的减少了用户的记忆避免了拼写错误

还有一个办法就是使用选择替代输入

![](https://this-is-my-images.oss-cn-beijing.aliyuncs.com/img/20200824154201.png)

选择是一个非常好用的交互方式, 一步步引导用户. 完全不需要记忆. 只是在使用上有限制. 选项特别多或者开放性的就不适合

> 当然这里说的减少输入是在不影响第一条原则的基础上, 如果因为减少输入而破坏第一条规则通用会引发问题 

### 遵循 XDG 规范
最后一条就是文件使用, 我们在开发 CLI 的时候或多或少都会和文件打交道,无论是配置文件, 数据文件还是编译产物. 我们在选择这些文件的位置的使用应该遵守  [XDG 规范](https://zh.wikipedia.org/wiki/Freedesktop.org) 避免用户磁盘内各种文件满天飞的场景

简单说 XDG 规范了不同类型文件存放的位置

* 用户数据文件:  ~/.local/share
* 用户配置文件: ~/.config
* 用户的缓存文件: ~/.cache

还有一些其他的定义暂时用不上就没看

## NodeJS 中的一些库
聊完了规范介绍一下 NodeJS 下面的一些用的上的库, 比如如何实现选择, 如何定义颜色…

### yargs

- 项目地址: https://github.com/yargs/yargs

NodeJS 实现命令行并不复杂就是等待输入给出输出就行了,  但是如果要实现一个完整的命令行工具还是有很多事情要做的比如 `--help` 参数的标准化解析 `yargs` 就解决了这个问题

只需要简单的几个定义就能实现一个完整的命令行工具, 你只需要实现具体的功能就可以了

```js
yargs
    .help()
    .alias('h', 'help')
    .alias('v', 'version')
    .locale('zh_CN')
    .example('mozi create -t func')
    .usage('用法: mozi <命令> [参数] [选项]')
    .demandCommand(1, '')
    .version(require('../../package.json').version)
    .command('create', '初始化一个 faas 项目', yargs => {
      yargs.usage('用法: mozi create --templet [选项]')
      .option('t', {
        alias: 'templet',
        describe: '选择需要创建的模板'
      })
      .example('mozi create --templet func')
    })
    .command('version', '发布版本', yargs => {
      yargs.usage('用法: mozi version')
    })
    .command('deploy', '部署版本', yargs => {
      yargs.usage('用法: mozi deploy')
    })
```



### inquirer
- 项目地址: https://github.com/SBoudrias/Inquirer.js

这是一个强大的 CLI 交互工具, 支持输入  / 确认 / 单选 / 复选等操作, 还包含了输入检查. 结果转换等能力

#### 输入校验

![](https://this-is-my-images.oss-cn-beijing.aliyuncs.com/img/20200824161529.png)

#### 单选

![](https://this-is-my-images.oss-cn-beijing.aliyuncs.com/img/20200824154201.png)


### signale
- 项目地址: https://github.com/klaussinani/signale

日志采集器特点是方便扩展, 能够很好的统一日志风格

![](https://this-is-my-images.oss-cn-beijing.aliyuncs.com/img/20200824162105.png)

### chalk
- 项目地址: https://github.com/chalk/chalk

可以为输出的 ASCII 码渲染上颜色

```
const chalk = require('chalk')
console.log(chalk.red('Hello world!'))
```


![](https://this-is-my-images.oss-cn-beijing.aliyuncs.com/img/20200824162711.png)

### ora
- 项目地址: https://github.com/sindresorhus/ora

当 CLI 在做一些耗时操作的时候比如打包, 因为没有任何输出很容易让用户以为卡死了, 这个时候就一定需要加一个加载动画的标签, 告诉用户程序正在进行中

![](https://github.com/sindresorhus/ora/blob/master/screenshot.svg)

