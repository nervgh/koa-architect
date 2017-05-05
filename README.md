# koa-architect

[![build status](http://gitlab.element-studio.ru:8008/npm/koa-architect/badges/master/build.svg)](http://gitlab.element-studio.ru:8008/npm/koa-architect/commits/master)

## About
Does architectural work for you.

## Package managers
### NPM
1. Describe your **package.json** file:

    ```json
    {
      "name": "your-app-name",
      "dependencies": {
        "koa-architect": "git+ssh://git@gitlab.element-studio.ru:npm/koa-architect.git#latest"
      }
    }
    ```
    
2. Execute in terminal:
    ```bash
    npm install
    ```

## Usage
Assume, we have next folder tree and code:
```
middleware/
middleware/01-foo/
middleware/01-foo/index.js
middleware/02-bar/
middleware/02-bar/index.js
middleware/route/
middleware/route/index.js
middleware/nested/
middleware/nested/index.js
middleware/nested/middleware/
middleware/nested/middleware/index/
middleware/nested/middleware/index/index.js
middleware/nested/middleware/baz/
middleware/nested/middleware/baz/index.js
```
**middleware/01-foo/index.js**
```js
module.exports = function (ctx, next) {
  // Doing here some work and go next
  ctx.state.foo = 1
  return next()
}
```
**middleware/02-bar/index.js**
```js
module.exports = function (ctx, next) {
  // Doing here some work and go next
  ctx.state.bar = 1
  return next()
}
```
**middleware/route/index.js**
```js
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
```
**middleware/nested/index.js**
```js
const path = require('path')
const architect = require('koa-architect')

// Since this folder contains nested middleware/routes
// we need use koa-architect to read them

exports.use = architect.readMiddlewareAndRoutes(path.join(__dirname, './middleware'))
```
**middleware/nested/middleware/index/index.js**
```js
exports.use = function (ctx) {
  ctx.response.body = ctx.originalUrl
}
```
**middleware/nested/middleware/baz/index.js**
```js
exports.get = {
  'index': function (ctx) {
    ctx.response.body = ctx.originalUrl
  }
}
```

And we launch our app using this way:
```js
const Koa = require('koa')
const architect = require('koa-architect')

let app = new Koa()

for(let middleware of architect.readMiddlewareAndRoutes('./middleware')) {
  app.use(middleware)
}
```

Thus we will get a server which handle requests next way:
```
GET --> / 
GET <-- 404 "Not Found"

GET --> /route
GET <-- 200 {"foo":1,"bar":1}

POST --> /route/test/1
POST <-- 200 "1"

GET --> /nested
GET <-- 200 "/nested"

GET --> /nested/baz
GET <-- 200 "/nested/baz"
```

See [./test/fixtures](./test/fixtures) for details.