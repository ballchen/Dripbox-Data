'use strict'

const router = require('koa-router')()
const uploads = require('./uploads')

router.post('/upload', uploads.create)

router.get('/', function *() {
  this.status = 200
})

const routes = router.routes()
module.exports = routes
