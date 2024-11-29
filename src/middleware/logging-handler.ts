import config from '../config';
import * as path from 'path';
import * as fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file';
import { createLogger, format, transports } from 'winston';

/**
 * Get the log level based on the environment
 */
const logLevel = config.server.environment === 'development' ? 'debug' : 'warn';

/**
 * Set default log directory or use the one from the config
 */
const directory = config.logging.directory || path.resolve('logs');

/**
 * Ensures that the logging directory exists. If not, it creates the directory.
 * @param {string} directory - The directory where logs will be stored.
 */
const ensureLogDirectoryExists = (directory: string): void => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

ensureLogDirectoryExists(directory);

/**
 * Sets up a daily rotated file transport for Winston logging.
 * @param {string} directory - The directory where log files will be stored.
 * @param {string} logLevel - The log level to be used for the log files.
 * @returns {DailyRotateFile} A configured DailyRotateFile transport.
 */
const createFileTransport = (directory: string, logLevel: string): DailyRotateFile => {
  return new DailyRotateFile({
    level: logLevel,
    filename: path.join(directory, '/%DATE%.log'),
    datePattern: config.logging.datePattern,
    zippedArchive: true,
    handleExceptions: true,
    maxSize: config.logging.maxSize,
    maxFiles: config.logging.maxFiles,
    format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
  });
};

/**
 * Set up daily rotation for log files
 */
const fileTransport = createFileTransport(directory, logLevel);

/**
 * Create the logger instance with Console and File transports
 */
const logger = createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(format.errors({ stack: true }), format.prettyPrint()),
    }),
    fileTransport,
  ],
  exceptionHandlers: [fileTransport], // Handle uncaught exceptions and log them
  exitOnError: false, // Do not exit the process on handled exceptions
});

export default logger;
