// Created by jiehe2   2018/5/10
const md5 = require("md5")
const fs = require("fs")
const unzip = require("unzip")
const path = require("path")
const cos = require("./src/cos.js")
const package = require("./package.json")

module.exports = function (directive) {
  if (directive === undefined || directive !== 'run') {
    console.log(`
***********************************************    
使用指南 : 
将命令行切换到需要上传到COS的文件夹路径, 然后执行
${package.name} run
***********************************************    
    `);
    return;
  }

  //适用于开发命令行程序时，读取命令启动位置目录的文件。
  var local_path = process.cwd();
  var local_path_md5 = md5(local_path);
  var zipFilePath = path.resolve(__dirname, "./cos_sync_tools_v5-master.zip")
  var unzipPath = path.resolve(__dirname, "unzip", local_path_md5)


  fs.createReadStream(zipFilePath).pipe(unzip.Extract({ path: unzipPath }))
    .on("finish", async () => {
      let answers = await cos.getCOSConfigAndSave(local_path_md5);

      let isGoodConfig = await cos.confirmConfig(answers);
      while (!isGoodConfig) {
        let kList  = await cos.reConfigureWhich(answers);
        answers = await cos.getCOSSpecificConfigAndSave(local_path_md5, kList)
        isGoodConfig = await cos.confirmConfig(answers);
      }

      cos.writeConfigini(unzipPath, answers);
      cos.writeStartBat(unzipPath);

      cos.sync(unzipPath);
    })
}


