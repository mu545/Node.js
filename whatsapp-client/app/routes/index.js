const express = require('express')
const message = require('./message.js')

const router = express.Router()

router.route('/message')
  .post(message.post)

module.exports = router
