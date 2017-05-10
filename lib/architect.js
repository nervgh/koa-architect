
const fs = require('fs')
const path = require('path')
const mount = require('koa-mount')
const Router = require('koa-trie-router')


exports.readMiddlewareAndRoutes = readMiddlewareAndRoutes
exports.loadRoutesFromModule = loadRoutesFromModule


/**
 * @param {String} dir
 * @return {Array<Function>}
 */
function readMiddlewareAndRoutes(dir) {
  let middleware = []

  for(let name of fs.readdirSync(dir)) {
    let module = require(path.join(dir, name))

    let array = isArray(module) ? module : [module]

    for(let middlewareOrRoutes of array) {
      // Is it a middleware?
      if (isFunction(middlewareOrRoutes)) {
        // Just add it to the stack
        middleware.push(middlewareOrRoutes)
      } else {
        // Otherwise, these are rotes probably
        // It means we need group them using a router
        // and mount by specific path
        let router = new Router()
        loadRoutesFromModule(router, middlewareOrRoutes)
        let route = name === 'index' ? '' : name
        middleware.push(mount(`/${route}`, router.middleware()))
      }
    }
  }

  return middleware
}


/**
 * Loads routes from module to the router
 * @param {Object} router
 * @param {Object} module
 */
function loadRoutesFromModule(router, module) {
  for(let verb in module) {
    if (verb === 'use' || router.hasOwnProperty(verb)) {
      if (isFunction(module[verb]) || isArray(module[verb])) {
        router[verb](module[verb])
      } else {
        for(let action in module[verb]) {
          let route = action.startsWith('/') ? action : '/' + action
          route = route === '/index' ? '/' : route
          router[verb](route, module[verb][action])
        }
      }
    }
  }
}


// ------------


/**
 * @param {*} any
 * @return {Boolean}
 */
function isArray(any) {
  return Array.isArray(any)
}
/**
 * @param {*} any
 * @return {Boolean}
 */
function isFunction(any) {
  return typeof any === 'function'
}