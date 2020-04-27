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
  // const token = ctx.request.get('Authorization')
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEyLCJ1c2VybmFtZSI6IkB0ZXN0VXNlckAiLCJpYXQiOjE1ODc2MzMxODYsImV4cCI6MTU4ODg0Mjc4Nn0.bzJBidYvlz3rQQ7jTTHsfwDyRaO3eEq_itnK_2gP4UY'
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
