const merge = require('lodash/merge')

export const Message = {
  SUCCESS: {
    code: 1,
    message: '操作成功'
  },
  FAIL: {
    code: 0,
    message: '操作失败'
  },
  LOGIN_INVALID: {
    code: 401,
    message: '登录失效'
  },
  PARAM_ERROR: {
    code: 400,
    message: '参数错误'
  },
  SYSTEM_ERROR: {
    code: 500,
    message: '系统异常'
  },
  SERVICE_ERROR: {
    code: 500,
    message: '服务异常'
  }
}

export function ReplyResult(msg, data = null, err) {
  return merge({}, msg, { data }, err ? { message: err } : null)
}
