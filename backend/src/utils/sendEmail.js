require("dotenv").config();

const nodemailer = require("nodemailer");

async function sendEmail({ from, to, subject, url }) {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from,
    to,
    subject,
    html: `<p>Hello,</p><p>Please verify your email by clicking the following link:</p><a href="${url}">${url}</a>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;
