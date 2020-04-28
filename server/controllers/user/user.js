import UserProxy from '~/server/provider/user'
import { bhash, bcompare } from '~/server/utils'

const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const ft = require('../../models/fields_table')

const jwtSecret = config.get('jwt.secret')
const jwtExpire = config.get('jwt.expire')

async function createUser (username, password) {
  const user = await UserProxy.save({ username, password })
  return user
}

export default class User {
  /**
   * 用户注册
   * @param ctx
   */
  static async register (ctx) {
    const username = ctx.checkBody('username').notEmpty().len(4, 20).value
    const password = ctx.checkBody('password').notEmpty().len(6, 20).value
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }
    const user = await UserProxy.findByUserName(username)
    if (user) {
      ctx.body = ctx.util.refail('用户名已被使用')
      return
    }

    const newPassword = bhash(password)
    const res = await createUser(username, newPassword)

    ctx.body = ctx.util.resuccess(res)
  }

  /**
   * 用户登录
   * @param ctx
   */
  static async login (ctx) {
    const username = ctx.checkBody('username').notEmpty().value
    const password = ctx.checkBody('password').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const user = await UserProxy.findByUserName(username)
    if (!user) {
      ctx.body = ctx.util.refail('用户不存在')
      return
    }

    const verifyPassword = bcompare(password, user.password)
    if (!verifyPassword) {
      ctx.body = ctx.util.refail('用户名或密码错误')
      return
    }

    user.token = jwt.sign({ id: user.id, username }, jwtSecret, {
      expiresIn: jwtExpire
    })
    ctx.body = ctx.util.resuccess(_.pick(user, ft.user))
  }

  static async userInfo (ctx) {
    const uid = ctx.state.user.id
    const user = await UserProxy.findOne({ id: uid })
    if (user) {
      user.roles = [0]
      ctx.body = ctx.util.resuccess(_.pick(user, ft.user))
    } else {
      ctx.body = ctx.util.refail()
    }
  }
}
