'use strict'

function render (body) {
  if (this.request.query.callback && this.method === 'GET') {
    return renderJSONP.call(this, body)
  }

  return renderJSON.call(this, body)
}

exports = module.exports = render

function renderJSON (body) {
  this.body = body
}

exports.renderJSON = renderJSON

function renderJSONP (body) {
  this.set('Content-Type', 'application/javascript')

  this.body = this.request.query.callback + '(' + JSON.stringify({
      meta: {
        status: this.status
      },
      data: body
    }) + ')'
}

exports.renderJSONP = renderJSONP
