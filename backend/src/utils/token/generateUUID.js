const crypto = require("crypto");

function generateUUID() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = generateUUID;
