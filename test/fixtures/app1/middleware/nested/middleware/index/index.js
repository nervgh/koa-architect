
// Routes

exports.use = function (ctx) {
  ctx.response.body = ctx.originalUrl
}