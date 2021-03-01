const express = require("express");
const { BaseError } = require("../cross-cutting/error");
const router = express.Router();
const homeRoutes = require("./homeRoutes");
const productRoutes = require("./productRoutes");

function registerRoutes(app) {
  const diContainer = app.locals.container;
  if (!diContainer) {
    throw new BaseError("dependency container wasn't set");
  }
  router.use("/products", productRoutes(diContainer));
  router.use("/", homeRoutes(diContainer));
  return router;
}

module.exports = registerRoutes;
