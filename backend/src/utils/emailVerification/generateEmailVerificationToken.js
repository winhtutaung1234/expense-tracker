require("dotenv").config();

const { EmailVerificationToken } = require("../../models");
const generateToken = require("../generateToken");
const bcrypt = require("bcrypt");

async function generateEmailVerificationToken({ id, email }) {
  const token = await generateToken();
  const url = `${process.env.APP_URL}/email-verify?user_id=${id}&token=${token}&email=${email}`;

  await EmailVerificationToken.destroy({ where: { user_id: id } });

  await EmailVerificationToken.create({
    user_id: id,
    token: await bcrypt.hash(token, 10),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return { url };
}

module.exports = generateEmailVerificationToken;
