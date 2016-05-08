'use strict'

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const _ = require('lodash')

const env = process.env.NODE_ENV || 'development'

const config = {
  port: +process.env.SERVER_PORT || 3002,
  host: process.env.SERVER_HOST || '0.0.0.0',
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: +process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
  }
}

// Load config file
try {
  _.merge(config, require('./' + env))
} catch (err) {
  console.log('Failed to load config:', env)
}

module.exports = config
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
