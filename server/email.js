const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  host: 'mail.clicbro.org',
  port: 26,
  secure: false,
  auth: {
    user: 'pruebaenvio@clicbro.org',
    pass: '=c7~[F(.*y_u'
  },
  tls: {
    rejectUnauthorized: false
  }
});
