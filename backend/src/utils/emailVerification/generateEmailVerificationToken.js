const { EmailVerificationToken } = require("../../models");
const generateToken = require("../generateToken");
const bcrypt = require("bcrypt");

async function generateEmailVerificationToken(userId) {
  const token = await generateToken();
  const url = `http://localhost:8000/api/email-verify?user_id=${userId}&token=${token}`;

  await EmailVerificationToken.destroy({ where: { user_id: userId } });

  await EmailVerificationToken.create({
    user_id: userId,
    token: await bcrypt.hash(token, 10),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return { url };
}

module.exports = generateEmailVerificationToken;
