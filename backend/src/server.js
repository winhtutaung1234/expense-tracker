require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { usersRouter } = require("./routers/users");
const { errorHandler } = require("./middlewares/common/errorHandler");
const cookieParser = require("cookie-parser");

const server = express();

const portName = process.env.PORT;

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

server.use(cookieParser());

server.use("/api", usersRouter);

server.use(errorHandler);

server.listen(portName, () => {
  console.log(`server running on port ${portName}`);
});
