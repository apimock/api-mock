module.exports = {
  pageSize: 30,
  mysql: {
    database: 'apimock',
    user: 'root',
    password: 'root',
    option: {
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql',
      timezone: '+08:00', // 时区 香港 北京
      // mysql连接池配置
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      define: {
        timestamps: false // 不自动添加 updateAt 和 createdAt
      },
      logging (sql, {bind}) {
        const res = bind ? sql + bind : sql
        console.info(res)
      }
    }
  },
  jwt: {
    "expire": "14 days",
    "secret": "apimock-secret"
  }
}
