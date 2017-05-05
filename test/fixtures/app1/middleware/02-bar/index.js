
// Middleware

module.exports = function (ctx, next) {
  // Doing here some work and go next
  ctx.state.bar = 1
  return next()
}