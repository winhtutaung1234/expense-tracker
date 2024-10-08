const multer = require("multer");
const errResponse = require("../error/errResponse");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file from multer: ", file);
    if (file.fieldname === "currency_image") {
      cb(null, "src/public/images/currencies");
    } else {
      cb(errResponse("Invalid field name for file upload", 400, "image"));
    }
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(
      errResponse(
        "Unsupported file type. Only JPEG and PNG are allowed.",
        400,
        "image"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
