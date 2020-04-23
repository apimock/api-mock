// import MockProxy from '~/server/provider/mock'

export default class MockApi {
  static async getApi (ctx) {
    ctx.body = await ctx.util.resuccess(ctx)
  }
}
