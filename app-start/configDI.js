const Db = require("../db");
const { ProductService } = require("../services");
const { ProductController, HomeController } = require("../controllers");
module.exports = {
  register(diContainer) {
    if (!diContainer) return;
    diContainer.factory(Db.name, Db);
    diContainer.factory(ProductService.name, ProductService);
    diContainer.factory(ProductController.name, ProductController);
    diContainer.factory(HomeController.name, HomeController);
  },
};
