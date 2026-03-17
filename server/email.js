const nodemailer = require('nodemailer');

const {
  HOST,
  USER_EMAIL,
  USER_PASSWORD,
  SMTP_PORT = 26,
  SMTP_SECURE = 'false',
  SMTP_REJECT_UNAUTHORIZED = 'true',
} = process.env;

const transporter = nodemailer.createTransport({
  host: HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === 'true',
  auth: USER_EMAIL && USER_PASSWORD ? {
    user: USER_EMAIL,
    pass: USER_PASSWORD,
  } : undefined,
  tls: {
    rejectUnauthorized: SMTP_REJECT_UNAUTHORIZED !== 'false',
  },
});

exports.transporter = transporter;
