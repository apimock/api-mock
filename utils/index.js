const bcrypt = require('bcryptjs')

export function bhash(str) {
  return bcrypt.hashSync(str, 8)
}

export function bcompare(str, hash) {
  return bcrypt.compareSync(str, hash)
}

export function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function genProjectId() {
  return (+new Date).toString(36) + randomInt(0, 99)
}
