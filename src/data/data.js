module.exports = {
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
      message : "cos路径",
      name : "cos_path"
    },{
      type : 'input',
      message : "是否使用HTTPS传输(传输速度较慢，适用于对传输安全要求高的场景), 1开启, 0关闭",
      name : "enable_https"
    }
  ]
}