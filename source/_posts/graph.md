title: Graoh Easy 使用介绍
tag:
	-flow
	-graph easy
date: 2019-1-11 17:22:00
---

在日常开发中流程图可能用的最多了，相关的工具也非常丰富。但是要说极客非 `graph easy` 莫属。上手简单，而且支持非常丰富的表达方式。大家可以参考这个教程试一试。

## 使用

### 安装 graph easy 

```
// 1. 
brew install graphviz

// 2. 安装 cpan，一路「回车」
cpan

// 3. 安装 Graph Easy
sudo cpan Graph:Easy

```

### 使用

```
graph-easy <<< '[a] -> [b]'
```

或者

```
graph-easy ./flow.graph
```

## graph easy 教程

- https://github.com/ironcamel/Graph-Easy
- https://or2.in/2017/05/02/graph-easy-ascii/

For instance this input:

```shell
[ Bonn ] -> [ Berlin ]
[ Berlin ] -> [ Frankfurt ] { border: 1px dotted black; }
[ Frankfurt ] -> [ Dresden ]
[ Berlin ] ..> [ Potsdam ]
[ Potsdam ] =>{label:'true'} [ Cottbus ]
```

would be rendered in ASCII as:

```shell
+------+     +---------+         .............     +---------+
| Bonn | --> | Berlin  | ------> : Frankfurt : --> | Dresden |
+------+     +---------+         :...........:     +---------+
               :
               :
               v
             +---------+  true   +-----------+
             | Potsdam | ======> |  Cottbus  |
             +---------+         +-----------+
```

## 中文问题修复

参考：https://blog.codingnow.com/2016/12/ascii_graph.html

### 找到 Graph Easy 的安装目录

`mdfind -name Easy.pm`

默认：`/Library/Perl/5.18/Graph/`

### 修改相关代码

```Perl
diff --git /Library/Perl/5.18/Graph/Easy.pm /Library/Perl/5.18/Graph/Easy.pm
index 0ae40fd..b67bacc 100644
--- a/lib/Graph/Easy.pm
+++ b/lib/Graph/Easy.pm
@@ -1570,7 +1570,9 @@ sub as_ascii
   # select 'ascii' characters
   $self->{_ascii_style} = 0;

-  $self->_as_ascii(@_);
+  my $asc = $self->_as_ascii(@_);
+  $asc =~ s/(\x{FFFF})//g;
+  $asc;
   }

 sub _as_ascii
diff --git /Library/Perl/5.18/Graph/Easy/Node.pm /Library/Perl/5.18/Graph/Easy/Node.pm
index b58f538..6d7d7c7 100644
--- a/lib/Graph/Easy/Node.pm
+++ b/lib/Graph/Easy/Node.pm
@@ -1503,6 +1503,9 @@ sub label

   $label = $self->_un_escape($label) if !$_[0] && $label =~ /\\[EGHNT]/;

+  # placeholder for han chars
+  $label =~ s/([\x{4E00}-\x{9FFF}])/$1\x{FFFF}/g;
+
   $label;
   }
```
