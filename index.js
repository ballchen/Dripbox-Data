'use strict'

const app = require('./server')
const config = require('./config')

app.listen(config.port, config.host, function () {
  console.log('Server listening on %s:%d', config.host, config.port)
})
