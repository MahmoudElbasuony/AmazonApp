const joi = require("joi");

const createProductDtoSchema = joi.object({
  title: joi.string().max(100).min(5).required(),
  description: joi.string().max(300).min(5).required(),
});

function CreateProductDto(title, description) {
  this.title = title;
  this.description = description;
  this.validate = () => {
    return createProductDtoSchema.validate(this, {
      skipFunctions: true,
      abortEarly: false,
    });
  };
}

module.exports = CreateProductDto;
