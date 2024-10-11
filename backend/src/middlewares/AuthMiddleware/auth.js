require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const { Device } = require("../../models");
const errResponse = require("../../utils/error/errResponse");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user_agent = req.headers["user-agent"];

  if (!authorization) {
    throw errResponse("Authorization header is missing", 401, "auth");
  }

  if (!user_agent) {
    throw errResponse("User agent required", 400, "auth");
  }

  const [type, token] = authorization.split(" ");

  if (!token) {
    throw errResponse("Token required", 401);
  }

  console.log("token from auth: ", token);

  if (type !== "Bearer") {
    throw errResponse("Token type must be Bearer", 400);
  }

  try {
    const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    console.log("data from auth:", data);

    const device = await Device.findByPk(data.device.id);

    if (!device) {
      throw errResponse(
        "You're trying to access a device that's not registered to your account",
        404,
        "device"
      );
    }

    if (user_agent !== device.user_agent) {
      throw errResponse(
        "User agent mismatch. Token is not valid for this device",
        401,
        "auth"
      );
    }

    req.user = data.user;
    next();
  } catch (err) {
    if (err.message === "jwt expired") {
      throw errResponse("Jwt refresh expired", 401, "jwt_refresh");
    }
    throw err;
  }
});

module.exports = auth;
