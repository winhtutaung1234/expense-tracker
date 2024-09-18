require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const errRespones = require("../../utils/error/errResponses");
const asyncHandler = require("express-async-handler");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({
      msg: "Authorization header is missing",
    });
  }

  const [type, token] = authorization.split(" ");

  if (!token) {
    throw errRespones("Token invalid or expired", 401);
  }

  if (type !== "Bearer") {
    return res.status(401).json({
      msg: "Token type must Bearer",
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      msg: "Token invalid or expired",
    });
  }
});

module.exports = auth;
