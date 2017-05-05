
// Routes

exports.get = {
  'index': function (ctx) {
    ctx.response.body = ctx.originalUrl
  }
}