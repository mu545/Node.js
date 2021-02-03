const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})

const sendMail = function (options, cb) {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    ...options
  }

  transporter.sendMail(mailOptions, cb)
}

module.exports.sendMail = sendMail
