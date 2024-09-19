require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const errRespones = require("../../utils/error/errResponse");
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
    throw errRespones("Authorization header is missing", 401);
  }

  const [type, token] = authorization.split(" ");

  if (!token) {
    throw errRespones("Token invalid or expired", 401);
  }

  if (type !== "Bearer") {
    throw errRespones("Token type must be Bearer", 400);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = auth;
