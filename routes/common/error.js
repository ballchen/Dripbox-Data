'use strict'

const render = require('./render')

const ERROR_CODE = exports.ERROR_CODE = {
  // 1000: Common error
  unknown: 1000,
  notFound: 1001,
  forbidden: 1002,
  rateLimitExceeded: 1003,
  bodyParse: 1004,
  postRateLimitExceeded: 1005,

  // 1100: Validation error
  validation: 1100,
  required: 1101,
  email: 1102,
  minLength: 1103,
  maxLength: 1104,
  birthday: 1105,
  allowOnly: 1106,
  number: 1107,
  integer: 1108,
  positiveNumber: 1109,
  negativeNumber: 1110,
  minValue: 1111,
  maxValue: 1112,
  batchUrl: 1113,
  uri: 1114,

  // 1200: Resource error
  userAlreadyExist: 1200,
  userNotFound: 1201,
  versionNotExist: 1202,

  // 1300: Data error
  wrongPassword: 1300,

  // 1400: Auth error
  notLogin: 1400,

  // 1500: Third party error
  s3Error: 1500
}

exports.OAUTH_ERROR_CODE = {
  invalidRequest: 'invalid_request',
  invalidClient: 'invalid_client',
  invalidGrant: 'invalid_grant',
  invalidScope: 'invalid_scope',
  invalidToken: 'invalid_token',
  insufficientScope: 'insufficient_scope',
  unauthorizedClient: 'unauthorized_client',
  unsupportedGrantType: 'unsupported_grant_type',
  accessDenied: 'access_denied',
  unsupportedResponseType: 'unsupported_response_type',
  serverError: 'server_error',
  temporarilyUnavailable: 'temporarily_unavailable'
}

const JOI_ERROR_CODE = {
  'any.required': ERROR_CODE.required,
  'string.email': ERROR_CODE.email,
  'string.min': ERROR_CODE.minLength,
  'string.max': ERROR_CODE.maxLength,
  'string.uri': ERROR_CODE.uri,
  'regex.birthday': ERROR_CODE.birthday,
  'regex.batchUrl': ERROR_CODE.batchUrl,
  'any.allowOnly': ERROR_CODE.allowOnly,
  'number.base': ERROR_CODE.number,
  'number.integer': ERROR_CODE.integer,
  'number.min': ERROR_CODE.minValue,
  'number.max': ERROR_CODE.maxValue,
  'array.min': ERROR_CODE.minLength,
  'array.max': ERROR_CODE.maxLength,
  'any.empty': ERROR_CODE.required
}

function handleJoiError (err) {
  let code = ERROR_CODE.validation
  let type = err.details[0].type
  this.status = 400

  if (type === 'string.regex.name') {
    type = 'regex.' + err.details[0].context.name
  }

  if (JOI_ERROR_CODE.hasOwnProperty(type)) {
    code = JOI_ERROR_CODE[type]
  }

  return render.call(this, {
    error: code,
    field: err.details[0].path,
    message: err.details[0].message
  })
}

exports.middleware = function *(next) {
  try {
    yield next
  } catch (err) {
    if (err.details) {
      return handleJoiError.call(this, err)
    }

    this.status = 500

    render.call(this, {
      error: ERROR_CODE.unknown,
      message: 'Internal server error'
    })

    if (this.log) this.log.error(err)
  }
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
exports.renderBearerTokenError = function (data) {
  let headers = [
    `Bearer realm="Dcard"`,
    `error="${data.error}"`,
    `error_description="${data.description}"`
  ]

  let body = {
    error: data.error,
    error_description: data.description
  }

  if (data.scope) {
    headers.push(`scope=${data.scope}`)
    body.scope = data.scope
  }

  this.set('WWW-Authenticate', headers.join(', '))
  render.call(this, body)
}
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
