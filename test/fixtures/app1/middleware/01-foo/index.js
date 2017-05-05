
// Middleware

module.exports = function (ctx, next) {
  // Doing here some work and go next
  ctx.state.foo = 1
  return next()
}