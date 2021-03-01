var argsList = require("args-list");

module.exports = function () {
  var dependencies = {};
  var factories = {};
  var diContainer = {};

  diContainer.factory = function (name, factory) {
    factories[name.toLowerCase()] = factory;
  };

  diContainer.register = function (name, dep) {
    dependencies[name.toLowerCase()] = dep;
  };

  diContainer.get = function (name) {
    if (!dependencies[name.toLowerCase()]) {
      var factory = factories[name.toLowerCase()];
      dependencies[name.toLowerCase()] = factory && diContainer.inject(factory);
      if (!dependencies[name.toLowerCase()]) {
        throw new Error("Cannot find module: " + name);
      }
    }
    return dependencies[name.toLowerCase()];
  };

  diContainer.inject = function (factory) {
    var args = argsList(factory)
      .filter((arg) => arg)
      .map(function (dependency) {
        return diContainer.get(dependency.toLowerCase());
      });
    return factory.apply(null, args);
  };

  return diContainer;
};
