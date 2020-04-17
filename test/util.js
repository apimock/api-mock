const request = require('supertest')
const app = require('~/server/split')

class Util {
  static login (username, password) {
    return request(app)
      .post('/api/login')
      .send({ username, password })
      .then(res => res.body.data)
  }

  static createUser (username = 'admin', password = '123456') {
    return request(app)
      .post('/api/register')
      .send({ username, password })
      .then(() => this.login(username, password))
  }

  static createRequest (server, token) {
    return function (url, method = 'get', ctoken = token) {
      return request(server)[method](url)
        .set('Authorization', ctoken)
    }
  }
}

module.exports = Util
