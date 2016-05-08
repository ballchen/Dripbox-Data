'use strict'

const render = require('../common/render')
const ERROR_CODE = require('../common/error').ERROR_CODE

module.exports = function () {
  return function *(next) {
    if (!this.session.user) {
      return render.call(this, {
        error: ERROR_CODE.notLogin,
        message: 'user not logged in'
      })
    }
    yield next
  }
}
