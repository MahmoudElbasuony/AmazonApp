const express = require("express");
const { ProductController } = require("../controllers");
const router = express.Router();

function registerProductRoutes(diContainer) {
  const productController = diContainer.get(ProductController.name);
  if (!productController) {
    return logger.warn("product controller wasn't registered!");
  }

  router.get("/create", productController.getCreateProductView);
  router.get("/edit/:id", productController.getEditProductView);
  router.post("/delete/:id", productController.deleteProduct);
  router.post("/update/:id", productController.updateProduct);
  router.get("/:id", productController.getById);
  router
    .route("/")
    .post(productController.createProduct)
    .get(productController.getAll);

  return router;
}

module.exports = registerProductRoutes;
