require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/common/errorHandler");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/AuthMiddleware/auth");

const { usersRouter } = require("./routers/user/users");
const { accountsRouter } = require("./routers/account/accounts");
const { currenciesRouter } = require("./routers/admin/currencies");
const { categoriesRouter } = require("./routers/category/category");
const { transcationsRouter } = require("./routers/transcation/transcation");

const server = express();

const portName = process.env.PORT;

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser());
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

server.use("/api", usersRouter);

server.use("/api/categories", categoriesRouter);

// protected routers
server.use(auth);

server.use("/api/accounts", accountsRouter);

server.use("/api/currencies", currenciesRouter);

server.use("/api/transcations", transcationsRouter);

server.use(errorHandler);

server.listen(portName, () => {
  console.log(`server running on port ${portName}`);
});
