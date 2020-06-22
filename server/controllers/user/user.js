import UserProxy from '~/server/provider/user'
import { bhash, bcompare } from '~/server/utils'

const jwt = require('jsonwebtoken')
const config = require('config')

const jwtSecret = config.get('jwt.secret')
const jwtExpire = config.get('jwt.expire')

async function createUser (username, email, password) {
  const user = await UserProxy.save({ username, email, password })
  return user
}

export default class User {
  /**
   * 用户注册
   * @param ctx
   */
  static async register (ctx) {
    const username = ctx.checkBody('username').notEmpty().len(4, 20).value
    const email = ctx.checkBody('email').notEmpty().len(4, 20).value
    const password = ctx.checkBody('password').notEmpty().len(6, 20).value
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }
    const user = await UserProxy.findByEmail(email)
    if (user) {
      ctx.body = ctx.util.refail('邮箱已被使用')
      return
    }

    const newPassword = bhash(password)
    const res = await createUser(username, email, newPassword)

    ctx.body = ctx.util.resuccess(res)
  }

  /**
   * 用户登录
   * @param ctx
   */
  static async login (ctx) {
    const email = ctx.checkBody('email').notEmpty().value
    const password = ctx.checkBody('password').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const user = await UserProxy.findByEmail(email)
    if (!user) {
      ctx.body = ctx.util.refail('用户不存在')
      return
    }

    const verifyPassword = bcompare(password, user.password)
    if (!verifyPassword) {
      ctx.body = ctx.util.refail('用户名或密码错误')
      return
    }

    const token = jwt.sign({ id: user.id, email }, jwtSecret, {
      expiresIn: jwtExpire
    })

    // user.setDataValue('token', token)
    ctx.body = ctx.util.resuccess({ token })
  }

  static async userInfo (ctx) {
    const uid = ctx.state.user.id
    const user = await UserProxy.findOne({ id: uid })
    if (user) {
      user.roles = [0]
      ctx.body = ctx.util.resuccess(user)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async update (ctx) {
    const uid = ctx.state.user.id
    const username = ctx.checkBody('username').empty().value
    const email = ctx.checkBody('email').empty().value
    const password = ctx.checkBody('password').empty().value
    const res = await UserProxy.save({ id: uid, username, email, password })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async star (ctx) {
    const uid = ctx.state.user.id
    const field = ctx.checkBody('field').notEmpty().value
    const values = ctx.checkBody('values').notEmpty().type('array').value
    const type = ctx.checkBody('type').notEmpty().value
    if (ctx.errors || !values.length) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const userData = await UserProxy.findOne({ id: uid }, [field])
    const stars = userData[field]
    let saveStarsArr = []
    if (stars) {
      try {
        const starsArr = JSON.parse(stars)
        if (type) {
          values.forEach((item) => {
            item = Number(item)
            if (!isNaN(item)) {
              const index = starsArr.indexOf(item)
              if (index !== -1) {
                starsArr.splice(index, 1)
              }
            }
          })
          saveStarsArr = starsArr
        } else {
          saveStarsArr = starsArr.concat(values)
        }
      } catch (e) {
        if (type) saveStarsArr = values
      }
    }
    saveStarsArr = saveStarsArr.filter((item) => !isNaN(item) && item !== null)

    const saveStarStr = Array.from(new Set(saveStarsArr)).toString().replace(/,+$/g, '')
    const saveData = { id: uid }
    saveData[field] = `[${saveStarStr}]`
    const user = await UserProxy.save(saveData)
    if (user) {
      ctx.body = ctx.util.resuccess(user)
    } else {
      ctx.body = ctx.util.refail()
    }
  }
}
