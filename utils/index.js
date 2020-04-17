const bcrypt = require('bcryptjs')

export function bhash(str) {
  return bcrypt.hashSync(str, 8)
}

export function bcompare(str, hash) {
  return bcrypt.compareSync(str, hash)
}
