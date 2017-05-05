
const path = require('path')
const architect = require('../../../../../lib/architect') // use koa-architect instead

// Since this folder contains nested middleware/routes
// we need use koa-architect to read them

// Routes

exports.use = architect.readMiddlewareAndRoutes(path.join(__dirname, './middleware'))