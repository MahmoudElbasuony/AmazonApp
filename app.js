const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const appRoutes = require("./routes");
const app = express();
const { Logger: logger } = require("./cross-cutting/utils");
const {
  NotFoundError,
  errorViewResult,
  InternalError,
  BaseError,
} = require("./cross-cutting/error");
const DIContainer = require("./bin/diContainer");
const { register } = require("./app-start/configDI");

app.locals.container = DIContainer();
register(app.locals.container);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  logger.trace(`${req.method} : ${req.path}`, req.body);
  next();
});

app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", appRoutes(app));

// catch 404
app.use(errorViewResult);

module.exports = app;
