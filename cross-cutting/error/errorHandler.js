const { Logger: logger } = require("../utils");
const BaseError = require("./baseError");

async function handleError(error) {
  await logger.error("Error occured", error);
}

function isTrustedError(error) {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}

module.exports = {
  handleError,
  isTrustedError,
};
