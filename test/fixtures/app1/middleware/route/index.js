
// Routes

exports.get = {
  'index': function (ctx) {
    ctx.response.body = ctx.state
  }
}

exports.post = {
  'test/:id': function (ctx) {
    ctx.response.body = ctx.params.id
  }
}