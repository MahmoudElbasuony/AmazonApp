const joi = require("joi");

const editProductDtoSchema = joi.object({
  id : joi.string().alphanum().required(),
  title: joi.string().max(100).min(5).required(),
  description: joi.string().max(300).min(5).required(),
});

function EditProductDto(id, title, description) {
  this.id = id;
  this.title = title;
  this.description = description;
  this.validate = () => {
    return editProductDtoSchema.validate(this, {
      skipFunctions: true,
      abortEarly: false,
    });
  };
}

module.exports = EditProductDto;
