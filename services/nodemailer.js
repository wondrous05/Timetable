const nodemailer = require('nodemailer');



const Sendmail = () => {
nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });
}

module.exports = Sendmail;