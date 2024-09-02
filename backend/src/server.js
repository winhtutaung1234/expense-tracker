require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/common/errorHandler");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/AuthMiddleware/auth");
const isAdmin = require("./middlewares/AuthMiddleware/isAdmin");

const { usersRouter } = require("./routers/user/users");
const { accountsRouter } = require("./routers/account/accounts");
const { currenciesRouter } = require("./routers/admin/currencies");

const server = express();

const portName = process.env.PORT;

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser()); // Place cookieParser before routes that use cookies
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

server.use("/api", usersRouter);

server.use("/api", auth, accountsRouter);
server.use("/api", auth, isAdmin, currenciesRouter);

server.use(errorHandler);

server.listen(portName, () => {
  console.log(`server running on port ${portName}`);
});
