const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  host: 'mail.charlotteenglishschool.com',
  port: 587,
  secure:false,
  auth: {
   user: "pruebaenvio@charlotteenglishschool.com",
   pass: "BE~&kCR^5Rwc"
  },
  tls:{
    rejectUnauthorized:false
  }
  });
