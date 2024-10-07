require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/common/errorHandler");
const cookieParser = require("cookie-parser");
const { apiV1Routers } = require("./routers/v1");

const server = express();

const portName = process.env.PORT;

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser());
server.use(
  cors({
    origin: ["http://localhost:3000", "https://nx85qwsd-3000.inc1.devtunnels.ms"],
    credentials: true,
  })
);

server.use("/api/v1", apiV1Routers);

server.use(errorHandler);

server.listen(portName, () => {
  console.log(`server running on port ${portName}`);
});
