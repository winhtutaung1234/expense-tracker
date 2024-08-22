require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { usersRouter } = require("./routers/users");
const { errorHandler } = require("./middlewares/common/errorHandler");

const server = express();

const portName = process.env.PORT;

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cors());

server.use("/api", usersRouter);

server.use(errorHandler);

server.listen(portName, () => {
  console.log(`server running on port ${portName}`);
});
