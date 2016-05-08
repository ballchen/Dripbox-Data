'use strict'

const koa = require('koa')
const cors = require('kcors')
const bodyParser = require('koa-bodyparser')
const mongo = require('koa-mongo')
const config = require('./config')

var session = require('koa-generic-session')
var redisStore = require('koa-redis')

const app = koa()
require('koa-qs')(app)
app.env = process.env.NODE_ENV || 'development'

app.keys = ['drip', 'dripdrip']
app.use(cors());
app.use(session({
  store: redisStore(config.redis)
}))
app.use(mongo(config.mongo))
app.use(bodyParser())

app.use(require('./routes/middlewares/logger'))
app.proxy = true

app.use(require('./routes'))

app.on('error', function (err) {
  this.log.error(err)
})

module.exports = app
