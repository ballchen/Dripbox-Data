'use strict'

const router = require('koa-router')()

router.get('/', function *() {
  this.status = 200
})

const routes = router.routes()
module.exports = routes
