const session = require('./session.js')
const message = require('./message.js')

const models = {
  session,
  message
}

const modelsMiddleware = function (req, res, next) {
  req.models = models

  next()
}

module.exports.models = models
module.exports.modelsMiddleware = modelsMiddleware
