const { Client } = require('whatsapp-web.js')
const QRCode = require('qrcode')
const mail = require('./mail.js')
const { models } = require('./models/index.js')

var client = null

// Handle qrcode recived
const reciveQr = function (qr) {
  models.session.findOne({
    session_id: 1
  }, function (err, session) {
    if (err) {
      console.error('Recive QR:', err)
    } else if (session === null) {
      createNewSession(qr)
    } else {
      updateQRCode(qr)
    }
  })
}

// create a new session
const createNewSession = function (qr) {
  const newSession = new models.session({
    session_id: 1,
    last_qrcode: null,
    last_session: null,
    last_authenticated: Date.now(),
    new_qrcode_content: qr,
    new_qrcode_recived: Date.now()
  })

  newSession.save(function (err, session) {
    if (err) {
      console.error('Create New Session:', err)
    } else {
      QRCode.toDataURL(qr, sendQRCode)
    }
  })
}

// update current qrcode
const updateQRCode = function (qr) {
  models.session.updateOne({
    session_id: 1
  }, {
    $set: {
      new_qrcode_content: qr,
      new_qrcode_recived: Date.now()
    }
  }, function (err, session) {
    if (err) {
      console.error('Update QRCode:', err)
    } else {
      QRCode.toDataURL(qr, sendQRCode)
    }
  })
}

// send qrcode to admin with mail
const sendQRCode = function (err, url) {
  if (!err) {
    const imageQRCode = new Buffer.from(url.substr(22), 'base64')

    mail.sendMail({
      to: process.env.WHATSAPP_MAIL,
      subject: 'PPJM Whatsapp Login',
      attachments: [
        {
          filename: 'wa-login.png',
          contentType: 'image/png',
          content: imageQRCode
        }
      ]
    }, function (err) {
      if (err) {
        console.error('Send QRCode:', err)
      }
    })
  } else {
    console.error('Generate QRCode:', err)
  }
}

// Handle authenticated session
const authenticated = function (newSession) {
  models.session.findOne({
    session_id: 1
  }, function (err, currentSession) {
    if (err) {
      console.error('Authenticate:', err)
    } else {
      saveNewSession(currentSession, newSession)
    }
  })
}

// Save a new session
const saveNewSession = function(currentSession, newSession) {
  models.session.updateOne({
    session_id: 1
  }, {
    $set: {
      last_qrcode: currentSession.new_qrcode_content,
      last_session: newSession,
      last_authenticated: Date.now()
    }
  }, function (err, session) {
    if (err) {
      console.error('Save New Session:', err)
    } else {
      mail.sendMail({
        to: process.env.WHATSAPP_MAIL,
        subject: 'PPJM Whatsapp Login',
        text: 'Login Berhasil!'
      })
    }
  })
}

// Handle on authentication failed
const authFailure = function () {
  mail.sendMail({
    to: process.env.WHATSAPP_MAIL,
    subject: 'PPJM Whatsapp Login',
    text: 'Login Gagal!'
  })
}

// Handle on recive message
const reciveMessage = function () {

}

// Handle on client has ready
const clientReady = function () {

}

/**
 * Send message to whatsapp account.
 *
 * @param   string
 * @param   string
 * @param   callback
 * @return  void
 */
const sendMessage = function (phone, content, cb) {
  const chatId = phone.substr(1) + '@c.us'

  client.sendMessage(chatId, content).then(function (res) {
    cb(true)
  }).catch(function (err) {
    saveMessage(phone, content, cb)
  })
}

// Save message to database
const saveMessage = function (phone, content, cb) {
  const newMessage = new models.message({
    created: Date.now(),
    phone: phone,
    content: content
  })

  newMessage.save(function (err, message) {
    cb()
  })
}

// Run a new connection to whatsapp
const runConnection = function () {
  models.session.findOne({
    session_id: 1
  }, function (err, session) {
    if (err) {
      console.error('Run Connection:', err)
    } else {
      initializeClient(session)
    }
  })
}

// Initialize whatsapp client
const initializeClient = function (session) {
  const clientOptions = {
    puppeteer: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      headless: true
    },
    qrRefreshIntervalMs: 3600000,
    qrTimeoutMs: 3600000,
    restartOnAuthFail: true
  }

  if (session !== null) {
    clientOptions.session = session.last_session
  }

  client = new Client(clientOptions)

  client.on('qr', reciveQr)
  client.on('authenticated', authenticated)
  client.on('auth_failure', authFailure)
  client.on('message', reciveMessage)
  client.on('ready', clientReady)
  client.initialize()
}

module.exports.runConnection = runConnection
module.exports.client = client
module.exports.sendMessage = sendMessage
