
const path = require('path')
const supertest = require('supertest')
const Koa = require('koa')
const architect = require('../lib/architect')


let app = new Koa()
let dir = path.join(__dirname, 'fixtures/app1/middleware')

for(let middleware of architect.readMiddlewareAndRoutes(dir)) {
  app.use(middleware)
}


describe('koa-architect', function () {
  let agent
  let server

  before(function (done) {
    server = app.listen(done)
    agent = supertest.agent(server)
  })

  after(function () {
    server.close()
  })

  it('GET "/" should\'t work', function () {
    return agent
      .get('/')
      .expect(404)
  })
  it('GET "/route" should work', function () {
    return agent
      .get('/route')
      .expect(200, '{"foo":1,"bar":1}')
  })
  it('POST "/route/test/1" should work', function () {
    return agent
      .post('/route/test/1')
      .expect(200, '1')
  })
  it('GET "/nested" should work', function () {
    return agent
      .get('/nested')
      .expect(200, '/nested')
  })
  it('POST "/nested" should work', function () {
    return agent
      .post('/nested')
      .expect(200)
  })
  it('GET "/nested/baz" should work', function () {
    return agent
      .get('/nested/baz')
      .expect(200, '/nested/baz')
  })
  it('POST "/nested/baz" shouldn\'t work', function () {
    return agent
      .post('/nested/baz')
      .expect(405)
  })
})