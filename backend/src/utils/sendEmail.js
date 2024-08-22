const nodemailer = require("nodemailer");

async function sendEmail({ from, to, subject, url }) {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3af1edc65fad74",
      pass: "8d8a07d4e66afc",
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
