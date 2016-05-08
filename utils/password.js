'use strict'

const bcrypt = require('bcrypt')

exports.generatePassword = function (pass) {
  const saltRounds = 10
  return bcrypt.hashSync(pass, saltRounds)
}

exports.comparePassword = function (pass, hash) {
  return bcrypt.compareSync(pass, hash)
}
