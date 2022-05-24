const nodemailer = require('nodemailer');
const { HOST, USER_EMAIL, USER_PASSWORD } = process.env;


exports.transporter = nodemailer.createTransport({
  host: HOST,
  port: 26,
  secure: false,
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});
