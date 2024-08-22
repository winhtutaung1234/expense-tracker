const crypto = require("crypto");

async function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = generateToken;
