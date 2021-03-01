const fs = require("fs");
const path = require("path");
const { BaseError } = require("../error");
const { AppUtility, Logger } = require("../utils");
const DEFAULT_CONFIG_FILENAME = "config.json";
const DEFAULT_CONFIG_FILE_PATH = path.resolve(
  __dirname,
  DEFAULT_CONFIG_FILENAME
);
const ENV_CONFIG_FILENAME = AppUtility.isDevelopment()
  ? "config.development.json"
  : "config.production.json";
const ENV_CONFIG_FILE_PATH = path.resolve(__dirname, ENV_CONFIG_FILENAME);
let _config = {};
let _initiated = false;

function _init() {
  if (_initiated) return;
  const isDefaultConfigFileExists = fs.existsSync(DEFAULT_CONFIG_FILE_PATH);
  const isENVConfigFileExists = fs.existsSync(ENV_CONFIG_FILE_PATH);

  populateConfig(isDefaultConfigFileExists, isENVConfigFileExists);

  if (isDefaultConfigFileExists) {
    watchFile(DEFAULT_CONFIG_FILE_PATH, () => {
      populateConfig(isDefaultConfigFileExists, isENVConfigFileExists);
      Logger.info(`Config file : ${DEFAULT_CONFIG_FILENAME} has been changed!`);
    });
    process.on("beforeExit", (_) => {
      fs.unwatchFile(DEFAULT_CONFIG_FILE_PATH);
    });
  }

  if (isENVConfigFileExists) {
    watchFile(ENV_CONFIG_FILE_PATH, () => {
      populateConfig(isDefaultConfigFileExists, isENVConfigFileExists);
      Logger.info(`Config file : ${ENV_CONFIG_FILENAME} has been changed!`);
    });
    process.on("beforeExit", (_) => {
      fs.unwatchFile(ENV_CONFIG_FILE_PATH);
    });
  }

  function watchFile(configFilePath, callback) {
    if (callback) {
      fs.watchFile(configFilePath, callback);
    }
  }

  function populateConfig(isDefaultConfigFileExists, isENVConfigFileExists) {
    if (isDefaultConfigFileExists) {
      const defaultConfigFileContent = fs.readFileSync(
        DEFAULT_CONFIG_FILE_PATH,
        { encoding: "utf-8" }
      );
      _config = JSON.parse(defaultConfigFileContent) || {};
    }

    if (isENVConfigFileExists) {
      const envConfigFileContent = fs.readFileSync(ENV_CONFIG_FILE_PATH, {
        encoding: "utf-8",
      });
      const envConfigObject = JSON.parse(envConfigFileContent);
      if (envConfigObject) {
        _config = { ..._config, ...envConfigObject };
      }
    }
  }
}

try {
  _init();
} catch (e) {
  throw new BaseError(
    "Error occured during reading application config",
    true,
    e
  );
}

module.exports = _config;
