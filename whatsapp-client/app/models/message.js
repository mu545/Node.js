const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  created: Date,
  phone: String,
  content: String
})

module.exports = mongoose.model('message', schema, 'messages')
