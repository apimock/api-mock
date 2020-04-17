const jwt = require('jsonwebtoken')
const config = require('config')
const jwtSecret = config.get('jwt.secret')

const checkToken = (token) => {
  if(!token) return false
  try {
    const res = jwt.verify(token, jwtSecret)
    if (res) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

export function validate (ctx, option) {
  const token = ctx.headers.Authorization
  const res = {
    code: 1,
    message: 'success'
  }
  if (option.auth) {
    if(!checkToken(token)) {
      res.code = -1
      res.message = '用户未登录'
    }
  }
  return res
}
