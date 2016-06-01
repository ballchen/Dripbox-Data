'use strict'

const koa = require('koa')
const cors = require('kcors')
const bodyParser = require('koa-bodyparser')
const mongo = require('koa-mongo')
const config = require('./config')

let session = require('koa-generic-session')
let redisStore = require('koa-redis')

const app = koa()
require('koa-qs')(app)
app.env = process.env.NODE_ENV || 'development'

app.keys = ['drip', 'dripdrip']
app.use(cors())
app.use(session({
  store: redisStore(config.redis)
}))
app.use(mongo(config.mongo))
app.use(bodyParser())

app.use(require('./routes/middlewares/logger'))
app.proxy = true

app.use(require('./routes'))

app.on('error', function (err) {
  console.log(err)
})

module.exports = app
