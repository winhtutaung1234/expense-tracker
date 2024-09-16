const { EmailVerificationToken } = require("../../models");
const errRespones = require("../error/errResponse");
const bcrpt = require("bcrypt");

async function validateEmailVerificationToken(user_id, token) {
  const emailToken = await EmailVerificationToken.findOne({
    where: { user_id },
  });

  if (!emailToken) {
    throw errRespones("Email verification token not found", 404);
  }

  if (Date.now() > new Date(emailToken.expires_at).getTime()) {
    await emailToken.destroy();

    throw errRespones("Email verification token is expired", 410);
  }

  if (!(await bcrpt.compare(token, emailToken.token))) {
    throw errRespones("Invalid Token", 400);
  }

  return emailToken;
}

module.exports = validateEmailVerificationToken;
