# cosync

快速上传本地文件夹到腾讯云COS

基于官方工具二次开发, 更加方便, 开箱即用!所有配置项都在运行时提示你如何配置, 并且会记录你的配置.

## 系统要求
* nodejs
* JDK (并且已将java.exe添加在系统PATH, 你在命令行执行java命令有结果就说明符合要求)

## 安装

```bash
$ npm install -g cosync
```

## 如何使用

例如你现在需要将本地的一个文件夹(c:\abc)上传到腾云讯COS.\
将命令行路径切换到对应文件夹(在本例子中式 C:\abc), 然后执行如下指令
```bash
$ cosync run
```

## 原理
本项目基于腾讯COS`同步工具包`二次开发, 更加简化了用户操作. 它的同步策略是增量同步.(也就是不会删除云端已有的文件, 只会做`覆盖文件`操作, 更加安全, 但同时也带来文件冗余问题)\
文件比较策略是 : 在本地维护一个已上传文件数据库,每次执行同步操作都会比较文件是否修改(与本地维护的数据库比较, 而不是与云端文件比较), 如果文件被修改就会被上传到腾讯云指定bucket 

## 示例
第一次执行\
![ScreenShot](https://raw.github.com/AJLoveChina/cosync/master/test/cosync.gif?t=2018年5月11日)

到腾讯云查看执行结果\
![ScreenShot](https://raw.github.com/AJLoveChina/cosync/master/test/result.gif?t=2018年5月11日)

重复执行能看到已经保存的配置, 不需要重新填写配置, 但是你仍然可以修改某个配置项\
![ScreenShot](https://raw.github.com/AJLoveChina/cosync/master/test/cosync_reexe.gif?t=2018年5月11日)