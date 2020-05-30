const Mock = require('mockjs')
const json5 = require('json5')

Mock.Random.extend({
  timestamp: function () {
    const time = new Date().getTime() + ''
    return +time.substr(0, time.length - 3)
  }
})

function formatJson (json) {
  try {
    return JSON.stringify(json5.parse(json), null, 2)
  } catch (err) {
    return json
  }
}

function jsonToStr (data) {
  if (typeof data === 'string') {
    return formatJson(data)
  } else if (typeof data === 'object') {
    return JSON.stringify(data, null, 2)
  } else {
    return data.toString()
  }
}

export function getMockValue (data, toStr = true) {
  let mockValue = ''
  try {
    const val = json5.parse(data)
    const mockValueFun = () => Mock.mock(val)
    mockValue = toStr ? jsonToStr(mockValueFun()) : mockValueFun()
  } catch (e) {
    mockValue = `解析出错：${e.message}`
  }
  return mockValue
}
