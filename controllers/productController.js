const Joi = require("joi");
const {
  BaseError,
  NotFoundError,
  BadRequestError,
  InternalError,
  errorViewResult,
} = require("../cross-cutting/error");
const { CreateProductDto, EditProductDto } = require("../models/dtos");

module.exports = function ProductController(productService) {
  if (!productService) {
    throw BaseError("Product service must be injected in product controller");
  }

  const productController = {};

  productController.getAll = async (req, res, next) => {
    const pageIndex = req.query["pageIndex"] || 0;
    const pageSize = req.query["pageSize"];
    try {
      const {
        totalCount = null,
        products,
      } = await productService.getAllProducts(pageIndex, pageSize);
      res.render("product/product-list", { products, totalCount });
    } catch (e) {
      next(new InternalError(e.message, req, e));
    }
  };

  productController.getById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const product = await productService.getProductById(id);
      if (product) {
        res.render("product/product", { product });
      } else {
        errorViewResult(
          new NotFoundError(`Product with id : ${id} not found`),
          req,
          res
        );
      }
    } catch (e) {
      next(new InternalError(e.message, req, e));
    }
  };

  productController.getCreateProductView = (req, res) => {
    res.render("./product/create-product", {
      product: new CreateProductDto(),
      error: null,
    });
  };

  productController.getEditProductView = async (req, res, next) => {
    const {
      value: { id },
      error,
    } = Joi.object({ id: Joi.required() }).validate(req.params);

    if (error) {
      const errorResult = new BadRequestError(`Product id ${id} required`, req);
      return errorViewResult(errorResult, req, res);
    }
    try {
      const product = await productService.getProductById(id);
      if (!product) {
        const errorResult = new NotFoundError(
          `Product with id ${id} not found`,
          req
        );
        return errorViewResult(errorResult, req, res);
      }

      const errors = getFalttenJoiErrors(error);
      res.render("./product/edit-product", {
        product,
        error: errors,
      });
    } catch (e) {
      next(new InternalError(e.message, req, e));
    }
  };

  productController.createProduct = async (req, res, next) => {
    const { title, description } = req.body;
    const dto = new CreateProductDto(title, description);
    const { error } = dto.validate();
    if (error) {
      const errors = getFalttenJoiErrors(error);
      return res.render("./product/create-product", {
        product: dto,
        error: errors,
      });
    }
    try {
      await productService.createProduct(dto);
    } catch (e) {
      next(new InternalError(e.message, req, e));
    }

    res.redirect("/products");
  };

  productController.deleteProduct = async (req, res, next) => {
    const {
      value: { id },
      error,
    } = Joi.object({ id: Joi.required() }).validate(req.params);

    if (error) {
      const errorResult = new BadRequestError(`Product id ${id} required`, req);
      return errorViewResult(errorResult, req, res);
    }
    try {
      await productService.deleteProduct(id);
      res.redirect("/products");
    } catch (e) {
      next(new InternalError(e.message, req, e));
    }
  };

  productController.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const productDto = new EditProductDto(id, title, description);
    const { error } = productDto.validate();
    if (error) {
      const errorResult = new BadRequestError(error.message, req);
      return errorViewResult(errorResult, req, res);
    }

    try {
      await productService.updateProduct(id, productDto);
      return res.redirect(`/products/${id}`);
    } catch (e) {
      next(new InternalError(e.message, req, e));
    }
  };

  return productController;
};

function getFalttenJoiErrors(error) {
  const errors = {};
  if (!error || !(error.details instanceof Array)) return errors;

  error.details.map((e) => {
    const keyName = e.context.key;
    return Object.assign(errors, { [keyName]: e.message });
  });

  return errors;
}
