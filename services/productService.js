const { BaseError } = require("../cross-cutting/error");
const { Product } = require("../models");

module.exports = function ProductService(db) {
  const productService = {};

  productService.getProductById = async (productId) => {
    const product = await db.Product.getProductById(productId);
    return product;
  };

  productService.getAllProducts = async (pageIndex = 0, pageSize = null) => {
    return await db.Product.getAllProducts(pageIndex, pageSize);
  };

  productService.createProduct = async (productDto) => {
    const newProduct = new Product(productDto.title, productDto.description);
    await db.Product.createProduct(newProduct);
    return newProduct;
  };

  productService.deleteProduct = async (productId) => {
    const existedProduct = await db.Product.getProductById(productId);
    if (!existedProduct) {
      throw BaseError(`Product with id ${productId} not found!`);
    }
    await db.Product.deleteProduct(productId);
  };

  productService.updateProduct = async (productId, productDto) => {
    const existedProduct = await db.Product.getProductById(productId);
    if (!existedProduct) {
      throw new BaseError(
        `Product with id ${id} may be deleted or not available at the moment!`
      );
    }
    return await db.Product.updateProduct(productId, productDto);
  };

  return productService;
};
