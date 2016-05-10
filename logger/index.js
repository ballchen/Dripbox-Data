'use strict'

const bunyan = require('bunyan')
const config = require('../config')

const logger = bunyan.createLogger({
  name: 'dripbox-data',
  level: config.logLevel,
  serializers: bunyan.stdSerializers
})

module.exports = logger
