const { createLogger, format, transports } = require("winston");

const httpTransportOptions = {
  host: process.env.DD_HOST,
  path: process.env.DD_PATH,
  ssl: true,
};

const logger = createLogger({
  level: "info",
  exitOnError: false,
  format: format.json(),
  transports: [new transports.Http(httpTransportOptions)],
});

module.exports = logger;