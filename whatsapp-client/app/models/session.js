const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  session_id: Number,
  last_qrcode: String,
  last_session: {
    WABrowserId: String,
    WASecretBundle: {
      key: String,
      encKey: String,
      macKey: String
    },
    WAToken1: String,
    WAToken2: String
  },
  last_authenticated: Date,
  new_qrcode_content: String,
  new_qrcode_recived: Date
})

module.exports = mongoose.model('session', schema, 'sessions')
