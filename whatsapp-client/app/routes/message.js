const { body, validationResult } = require('express-validator/check')
const { sendMessage } = require('../wa.js')

function validationInput(req, res, next) {
  let errors = validationResult(req);

  if (!errors.isEmpty()) res.status(400).json({err: errors.array({onlyFirstError: true})});
  else next();
}

function createInput(req, res, next) {
  res.locals.input = {
    phone: req.body.phone,
    content: req.body.content
  }

  next()
}

module.exports.post = [
  body('phone')
    .exists({checkFalsy: true}).withMessage('phone number is required')
    .isLength({min: 6, max: 16}).withMessage('phone number is not valid')
    .isNumeric().withMessage('phone number is not valid'),
  body('content')
    .exists({checkFalsy: true}).withMessage('content message is required'),
  validationInput,
  createInput,
  function (req, res) {
    sendMessage(res.locals.input.phone, res.locals.input.content, function (result) {
      if (result) {
        res.status(200).json({
          result: true
        })
      } else {
        res.status(400).json({
          result: false
        })
      }
    })
  }
]
