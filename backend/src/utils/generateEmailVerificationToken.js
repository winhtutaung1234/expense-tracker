const { EmailVerificationToken } = require("../models");
const errRespones = require("./errResponse");

async function generateEmailVerificationToken({ userId, token }) {
  await EmailVerificationToken.create({
    user_id: userId,
    token,
    expires_at: new Date(Date.now() + 5 * 60 * 1000),
  });
}

module.exports = generateEmailVerificationToken;
