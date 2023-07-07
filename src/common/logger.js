const { createLogger, format, transports } = require("winston");
require("dotenv").config();

const httpTransportOptions = {
  host: process.env.DD_HOST,
  path: process.env.DD_PATH,
  ssl: true,
};

const _logger = createLogger({
  level: "info",
  exitOnError: false,
  format: format.json(),
  transports: [new transports.Http(httpTransportOptions)],
});

const logger = () => {
  const info = (message, user_id, data) => {
    _logger.log("info", message, { data, user_id });
  };

  const error = (message, user_id, data) => {
    _logger.log("error", message, { data, user_id });
  };

  const warn = (message, user_id, data) => {
    _logger.log("warn", message, { data, user_id });
  };

  return {
    info,
    error,
    warn,
  };
};

module.exports = logger();
