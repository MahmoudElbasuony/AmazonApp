const express = require("express");
const router = express.Router();
const { HomeController } = require("../controllers");
const { BaseError } = require("../cross-cutting/error");
const { Logger: logger } = require("../cross-cutting/utils");
function registerHomeRoutes(diContainer) {
  const homeController = diContainer.get(HomeController.name);
  if (!homeController) {
    return logger.warn("home controller wasn't registered!");
  }
  router.get("/", homeController.index);
  router.get("/index", homeController.index);
  router.get("/home", homeController.index);
  return router;
}

module.exports = registerHomeRoutes;
