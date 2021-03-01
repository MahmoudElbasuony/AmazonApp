const BaseError = require("./baseError");
const {
  Logger: logger,
  AppUtility: { isDevelopment },
} = require("../utils");

function NotFoundError(message, req, innerException) {
  if (!new.target) {
    throw new Error(`can't call ${NotFoundError.name} directly`);
  }
  BaseError.call(this, message, true, innerException);
  const status = 404;

  this.getStatus = () => status;
  this.getMessage = () => {
    let errorMsg = `Status : ${this.getStatus()}`;
    const { path } = req || {};
    if (!message && !path) {
      errorMsg += ` - Not found`;
    } else if (!message && path) {
      errorMsg += ` - Path ${path} Not found`;
    } else if (message && !path) {
      errorMsg += ` - ${message}`;
    } else {
      errorMsg += ` - ${message} at ${path}`;
    }
    return errorMsg;
  };

  this.toString = () => {
    return this.getMessage();
  };
}

NotFoundError.prototype = Object.create(BaseError.prototype);
NotFoundError.prototype.constructor = NotFoundError;

function BadRequestError(message, req, innerException) {
  if (!new.target) {
    throw new Error(`can't call ${BadRequestError.name} directly`);
  }
  BaseError.call(this, message, true, innerException);
  const status = 400;

  this.getStatus = () => status;
  this.getMessage = () => {
    let errorMsg = `Status : ${this.getStatus()}`;
    const { path } = req || {};
    if (!message && !path) {
      errorMsg += ` - Bad Request`;
    } else if (!message && path) {
      errorMsg += ` - Path ${path} Bad Request`;
    } else if (message && !path) {
      errorMsg += ` - ${message}`;
    } else {
      errorMsg += ` - ${message} at ${path}`;
    }
    return errorMsg;
  };

  this.toString = () => {
    return this.getMessage();
  };
}

BadRequestError.prototype = Object.create(BaseError.prototype);
BadRequestError.prototype.constructor = BadRequestError;

function InternalError(message, req, innerException) {
  if (!new.target) {
    throw new Error(`can't call ${InternalError.name} directly`);
  }
  BaseError.call(this, message, true, innerException);
  const status = 500;

  this.getStatus = () => status;
  this.getMessage = () => {
    let errorMsg = `Status : ${this.getStatus()}`;
    const { path } = req || {};
    if (!message && !path) {
      errorMsg += ` - Intenral Error Occured`;
    } else if (!message && path) {
      errorMsg += ` - Path ${path} Intenral Error `;
    } else if (message && !path) {
      errorMsg += ` - ${message}`;
    } else {
      errorMsg += ` - ${message} at ${path}`;
    }
    return errorMsg;
  };

  this.toString = () => {
    return this.getMessage();
  };
}

InternalError.prototype = Object.create(BaseError.prototype);
InternalError.prototype.constructor = InternalError;

function errorViewResult(error, req, res, next) {
  let errorDescription = "";
  if (error instanceof BaseError) {
    errorDescription = error.getMessage();
  } else {
    errorDescription = error.message;
  }
  res.status(error.getStatus() || 500);
  res.render("error", { error: errorDescription });
  logger.error(errorDescription, {
    path: req.path,
    method: req.method,
    body: req.body,
  });
}

module.exports = {
  NotFoundError,
  BadRequestError,
  InternalError,
  errorViewResult,
};
