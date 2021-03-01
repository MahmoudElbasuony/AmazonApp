function BaseError(message, isOperational, internalEexception) {
  Error.call(this, message);
  this.isOperational = isOperational;
  this.message = message;
  this.getMessage = () => {
    return this.message;
  };
  this.internalEexception = internalEexception;
}

BaseError.prototype = Error.prototype;
BaseError.prototype.constructor = BaseError;

module.exports = BaseError;
