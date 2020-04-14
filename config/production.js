module.exports = {
  mysql: {
    database: 'apimock',
    user: 'root',
    password: 'root',
    option: {
      host: '10.10.142.219',
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
      }
    }

  }
}
