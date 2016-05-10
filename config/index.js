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
  },
  mongo: {
    host: process.env.MONGO_HOST || '0.0.0.0',
    port: process.env.MONGO_PORT || 27017,
    db: process.env.MONGO_DB || 'metadata'
  },
  aws: {
    signatureVersion: process.env.AWS_SIGNATURE || 'v4',
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    Bucket: process.env.AWS_BUCKET
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
