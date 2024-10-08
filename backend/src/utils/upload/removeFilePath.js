const fs = require("fs").promises;
const errResponse = require("../error/errResponse");

async function removeFilePath(path) {
  try {
    await fs.access(path);
    await fs.unlink(path);
  } catch (err) {
    console.log("error object from remove file: ", err);
    if (err.code === "ENOENT") {
      throw errResponse("File path not found", 404, "path");
    }

    throw errResponse(err.message, 400, "path");
  }
}

module.exports = removeFilePath;
