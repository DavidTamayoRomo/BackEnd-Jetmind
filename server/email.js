const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  host: 'mail.clicbro.org',
  port: 26,
  secure: false,
  auth: {
    user: 'pruebaenvio@clicbro.org',
    pass: 'ahYg9XJ-JNAj'
  },
  tls: {
    rejectUnauthorized: false
  }
});
