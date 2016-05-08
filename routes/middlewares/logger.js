'use strict'

const logger = require('../../logger')

module.exports = function *(next) {
  this.log = logger

  try {
    yield next
  } catch (err) {
    logger.error({
      req: this.request,
      res: this.response,
      err: err
    })
    throw err
  }

  logger.info({
    req: this.request,
    res: this.response
  })
}
