const winston = require("winston");
const path = require("path");
const { AppUtility } = require("./appUtility");
const logginfDirPath = path.dirname(path.dirname(__dirname));

const customLevels = {
  levels: {
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    fatal: 0,
  },
  colors: {
    trace: "white",
    debug: "green",
    info: "green",
    warn: "yellow",
    error: "red",
    fatal: "red",
  },
};

const dev_formatter = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.splat(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`;
  })
);
const prod_formatter = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.splat(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`;
  })
);

winston.addColors(customLevels.colors);

const prodTransport = new winston.transports.File({
  dirname: path.resolve(logginfDirPath, "logging"),
  filename: "error.log",
  level: "error",
  format : prod_formatter
});

const devTransport = new winston.transports.Console({
  format: dev_formatter,
});

const logger = winston.createLogger({
  level: AppUtility.isDevelopment() ? "trace" : "error",
  levels: customLevels.levels,
  transports: [AppUtility.isDevelopment() ? devTransport : prodTransport],
});

module.exports = {
  log(level, msg, data) {
    logger.log(level, msg, data);
  },

  trace(msg, meta) {
    logger.log("trace", msg, meta);
  },

  debug(msg, meta) {
    logger.debug(msg, meta);
  },

  info(msg, meta) {
    logger.info(msg, meta);
  },

  warn(msg, meta) {
    logger.warn(msg, meta);
  },

  error(msg, meta) {
    logger.error(msg, meta);
  },

  fatal(msg, meta) {
    logger.log("fatal", msg, meta);
  },
};
