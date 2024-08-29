require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

async function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({
      msg: "Authorization header is missing",
    });
  }

  const [type, token] = authorization.split(" ");

  if (!token) {
    return res.status(401).json({
      msg: "Token required",
    });
  }

  if (type !== "Bearer") {
    return res.status(401).json({
      msg: "Token type must Bearer",
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (!user.verified) {
      return res.status(400).json({ msg: "User not verified yet" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      msg: "Token invalid or expired",
    });
  }
}

module.exports = auth;
