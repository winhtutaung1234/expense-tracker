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
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(400).json({
        msg: "Authorization header is missing",
      });
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        msg: "Token type must be expired or token required",
      });
    }

    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      msg: err.message,
    });
  }
}

module.exports = auth;
