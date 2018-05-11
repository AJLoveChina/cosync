const path = require("path")
const fs = require("fs-extra")

module.exports = {
  getChoices() {
    let configFilePath = path.resolve(__dirname, "../config/lastConfig.json");
    console.log(configFilePath);
    let map = {};
    if (fs.existsSync(configFilePath)) {
      try {
        map = JSON.parse(fs.readFileSync(configFilePath));
      } catch(ex) {}
    }

    return this.choices.map(item => {
      if (map[item.name] !== undefined) {
        item.default = map[item.name];
      }
      return item;
    })

  },
  choices : [
    {
      type : 'input',
      message : "# appid 信息(可在 https://console.qcloud.com/capi 查看)",
      name : "appid"
    },{
      type : 'input',
      message : "用户的秘钥 secret_id (可在 https://console.qcloud.com/capi 查看)",
      name : "secret_id"
    },{
      type : 'input',
      message : "用户的秘钥 secret_key  (可在 https://console.qcloud.com/capi 查看)",
      name : "secret_key"
    },{
      type : 'input',
      message : "Bucket的名称",
      name : "bucket"
    },{
      type : 'input',
      message : "用户的region信息. COS地域的简称请参照 https://www.qcloud.com/document/product/436/6224",
      name : "region"
    },{
      type : 'input',
      message : "存储类型, 标准(standard), 低频(standard_ia), 近线(nearline)",
      name : "storage_class"
    },{
      type : 'input',
      message : "cos路径, 请以斜线 / 开始, 如果是上传到bucket根路径请设置为 / ",
      name : "cos_path"
    },{
      type : 'input',
      message : "是否使用HTTPS传输(传输速度较慢，适用于对传输安全要求高的场景), 1开启, 0关闭",
      name : "enable_https"
    }
  ]
}