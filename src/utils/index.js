import json5 from 'json5'

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

export function checkJson5 (json) {
  try {
    json5.parse(json)
    return true
  } catch (e) {
    return false
  }
}
