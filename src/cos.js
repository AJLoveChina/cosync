// Created by jiehe2   2018/5/10
const inquirer = require("inquirer")
const fs = require("fs-extra")
const path = require("path")
const child_process = require('child_process');
const data = require('./data/data.js')

module.exports = {
  isValidLocalPath(str) {
    return !/^[\x00-\x7F]*$/.test(str);
  },
  sync(unzipPath) {
    var filepath = path.resolve(unzipPath, 'cos_sync_tools_v5-master', 'run.bat')
    console.log(filepath);


    return new Promise((resolve, reject) => {
      child_process.exec(filepath, function(err, stdout, stderr) {
        if (err) {
          console.error(err);
          return;
        }

        console.log(stdout);
      });
    })
  },
  writeStartBat(unzipPath) {
    var batdir = path.resolve(unzipPath, "cos_sync_tools_v5-master");
    var batpath = path.resolve(batdir, "run.bat");

    batdir = batdir.replace(/\\/g, "\\\\");
    batdir = batdir.replace(/\//g, "//");


    fs.writeFileSync(batpath, `@echo on
set cur_dir=${batdir}
cd %cur_dir%
set my_java_cp=.;%cur_dir%\\dep\\*;%cur_dir%\\src\\main\\resources
java -Dfile.encoding=UTF-8 -cp "%my_java_cp%" com.qcloud.cos_sync_tools_xml.App
echo "done";`)

  },
  writeConfigini(unzipPath, answers) {
    var iniPath = path.resolve(unzipPath, "cos_sync_tools_v5-master", "conf", "config.ini");

    answers.local_path = answers.local_path.replace(/\\+/g, '\\\\');

    fs.writeFileSync(iniPath, `secret_id=${answers.secret_id}
# 用户的秘钥 secret_key  (可在 https://console.qcloud.com/capi 查看)
secret_key=${answers.secret_key}
# Bucket的命名规则为{name}-{appid}，即bucket名必须包含appid, 例如movie-1251000000
bucket=${answers.bucket}-${answers.appid}
# 用户的region信息. COS地域的简称请参照 https://www.qcloud.com/document/product/436/6224
region=${answers.region}
# 存储类型, 标准(standard), 低频(standard_ia), 近线(nearline)
storage_class=${answers.storage_class}
# 本地路径
local_path=${answers.local_path}
# cos路径
cos_path=${answers.cos_path}
# 是否使用HTTPS传输(传输速度较慢，适用于对传输安全要求高的场景), 1开启, 0关闭
enable_https=${answers.enable_https}`)
  },

  confirmConfig(config) {
    let data = JSON.stringify(config, null, 2)
    return inquirer.prompt([{
      type : 'list',
      message : `${data}\n请确认配置是否正确 :`,
      name : 'choice',
      choices : [
        "正确",
        "我要重新配置"
      ]
    }]).then((answers) => answers.choice === '正确');
  },

  reConfigureWhich(config) {
    var keys = Object.keys(config).map(k => {
      return {
        name : k,
        value : k
      }
    })
    let all = "_all";

    keys.unshift({
      name : "全部",
      value : all
    })

    return inquirer.prompt([{
      type : "checkbox",
      name : "checkbox",
      message : "请勾选你需要修改的配置项(space键选择)",
      choices : keys
    }]).then(answers => {
      var result = [];
      if (answers.checkbox.indexOf(all) !== -1) {
        result = Object.keys(config);
      } else {
        result = answers.checkbox;
      }

      return result;
    })

  },

  getCOSConfig(local_path_md5, force) {
    var jsonPath = path.resolve(__dirname, "./config", local_path_md5 + ".json");

    if (fs.existsSync(jsonPath) && !force) {
      return new Promise((resolve, reject) => {
        resolve(JSON.parse(fs.readFileSync(jsonPath)))
      })
    }
    let list = data.getChoices();

    return inquirer.prompt(list).then((answers) => {
      answers.local_path = process.cwd();
      return answers;
    })
  },

  getCOSConfigAndSave(local_path_md5, force) {
    return this.getCOSConfig(local_path_md5, force).then(answers => {
      this.saveCOSConfig(local_path_md5, answers);

      return answers;
    })
  },

  async getCOSSpecificConfigAndSave(local_path_md5, kList) {
    let originalconfig = await this.getCOSConfig(local_path_md5);

    let choices = data.getChoices().filter(item => kList.indexOf(item.name) !== -1);
    let answers = await inquirer.prompt(choices);

    let finalConfig = Object.assign(originalconfig, answers)

    this.saveCOSConfig(local_path_md5, finalConfig);

    return finalConfig;
  },

  saveCOSConfig(local_path_md5, answers) {
    var jsonPath = path.resolve(__dirname, "./config", local_path_md5 + ".json");
    var lastConfigFile = path.resolve(__dirname, "./config", "lastConfig.json");
    fs.ensureFileSync(jsonPath)
    fs.ensureFileSync(lastConfigFile)
    fs.writeFileSync(jsonPath, JSON.stringify(answers, null, 2));
    fs.writeFileSync(lastConfigFile, JSON.stringify(answers, null, 2));
  }
}