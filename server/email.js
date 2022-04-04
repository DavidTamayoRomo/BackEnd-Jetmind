const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  host: 'mail.clicbro.org',
  port: 26,
  secure: false,
  auth: {
    user: 'pruebaenvio@clicbro.org',
    pass: 'KtjZB&I3?HQd'
  },
  tls: {
    rejectUnauthorized: false
  }
});
