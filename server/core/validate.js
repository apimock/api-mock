const jwt = require('jsonwebtoken')
const config = require('config')
const jwtSecret = config.get('jwt.secret')

const checkToken = (token) => {
  if (!token) return false
  try {
    const res = jwt.verify(token, jwtSecret)
    if (res) {
      return res
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

export function validate (ctx, option) {
  const token = ctx.request.get('Authorization').replace(/Bearer\s/, '')
  const res = {
    code: 1,
    message: 'success'
  }
  if (option.auth) {
    const checked = checkToken(token)
    if (checked) {
      ctx.state.user = checked
    } else {
      res.code = -1
      res.message = '用户未登录'
    }
  }
  return res
}
