require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { usersRouter } = require("./routers/users");
const { errorHandler } = require("./middlewares/common/errorHandler");
const cookieParser = require("cookie-parser");
const { accountsRouter } = require("./routers/accounts");
const { currenciesRouter } = require("./routers/currencies");
const auth = require("./middlewares/AuthMiddleware/auth");
const isAdmin = require("./middlewares/AuthMiddleware/isAdmin");

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
server.use("/api", accountsRouter);
server.use("/api", auth, isAdmin, currenciesRouter);

server.use(errorHandler);

server.listen(portName, () => {
  console.log(`server running on port ${portName}`);
});
