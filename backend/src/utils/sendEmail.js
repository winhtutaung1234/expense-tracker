const nodemailer = require("nodemailer");

async function sendEmail({ from, to, subject, url }) {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "4d1089395ae6e0",
      pass: "b3dcdb4ab3fc5c"
    }
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
