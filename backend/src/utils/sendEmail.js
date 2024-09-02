require("dotenv").config();

const nodemailer = require("nodemailer");

async function sendEmail({ from, to, subject, url }) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_USER,
      pass: process.env.APP_PASS,
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
