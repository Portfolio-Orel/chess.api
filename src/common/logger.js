require("dotenv").config();

const { createLogger, format, transports, config } = require("winston");

// Datadog config
const httpTransportOptions = {
  host: process.env.DATADOG_HOST,
  path: process.env.DATADOG_PATH,
  ssl: true,
  port: 443,
};
console.log(httpTransportOptions);

const logger = createLogger({
  exitOnError: false,
  format: format.json(),
  transports: [new transports.Http(httpTransportOptions)],
  exceptionHandlers: [new transports.Http(httpTransportOptions)],
});

module.exports = logger;
