import json5 from 'json5'
const bcrypt = require('bcryptjs')
const { pathToRegexp } = require('path-to-regexp')

export function bhash (str) {
  return bcrypt.hashSync(str, 8)
}

export function bcompare (str, hash) {
  return bcrypt.compareSync(str, hash)
}

export function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 安全的 decodeURIComponent
 * @param String str
 */

export function safeDecodeURIComponent (str) {
  try {
    return decodeURIComponent(str)
  } catch (e) {
    return str
  }
}

/**
 * 解析出 params 对象
 *
 * /user/nick (/user/:name) => { name: 'nick' }
 *
 * @param String restURL /user/:name
 * @param String fullURL /user/nick
 */

export function params (restURL, fullURL) {
  const params = {}
  const paramNames = []
  const api = pathToRegexp(restURL, paramNames)
  const captures = fullURL.match(api)

  if (!captures) return {}

  captures.slice(1).forEach((value, i) => {
    /* istanbul ignore else */
    if (paramNames[i]) {
      params[paramNames[i].name] = safeDecodeURIComponent(value)
    }
  })

  return params
}

export function delay (time) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, time)
  })
}

export function getPage (countAll, pageSize, pageNo) {
  const totalCount = countAll.count !== null ? countAll.count : countAll
  const totalPage = pageSize === 0 ? 1 : Math.ceil(totalCount / pageSize)
  return {
    pageSize,
    pageNo,
    totalPage,
    totalCount
  }
}

export function json5Parse (json) {
  try {
    return json5.parse(json)
  } catch (err) {
    return json
  }
}

export function jsonParse (json) {
  try {
    return JSON.parse(json)
  } catch (err) {
    return json
  }
}

export function filterEmptyKey (data) {
  if (!Array.isArray(data)) return data

  return data.filter((item) => {
    return item.key !== ''
  })
}

export function uniqueKey (arr, keyName) {
  const res = []
  arr.forEach((v) => {
    if (!res.length || !res.some(x => x[keyName] === v[keyName])) {
      res.push(v)
    }
  })
  return res
}

export function keyValueToStr (data) {
  if (Array.isArray(data)) {
    data = filterEmptyKey(data)
    data = uniqueKey(data, 'key')
    return JSON.stringify(data)
  } else {
    return data
  }
}

export function zipKeyValue (arr) {
  if (!Array.isArray(arr)) {
    try {
      arr = JSON.parse(arr)
    } catch (e) {
      arr = []
    }
  }
  const obj = {}
  if (!arr.length) return obj

  arr.forEach((item) => {
    if (item.key !== null && item.value !== null) {
      obj[item.key] = item.value
    }
  })
  return obj
}
