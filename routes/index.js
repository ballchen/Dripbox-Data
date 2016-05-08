'use strict'

const router = require('koa-router')()

router.use(require('./common/error').middleware);

router.use('/api', require('./api'));

router.get('/', function *() {
  this.status = 200
})

module.exports = router.routes()
