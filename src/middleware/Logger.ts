import { ENVIRONMENT, LOG_DIRECTORY } from '../config';
import * as path from 'path';
import * as fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file';
import { createLogger, format, transports } from 'winston';

let dir = LOG_DIRECTORY;
if (!dir) dir = path.resolve('logs');

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

const logLevel = ENVIRONMENT === 'development' ? 'debug' : 'warn';

const transport: DailyRotateFile = new DailyRotateFile({
  level: logLevel,
  filename: dir + '/%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  handleExceptions: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json()
  ),
});

const Logger = createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint()
      ),
    }),
    transport,
  ],
  exceptionHandlers: [transport],
  exitOnError: false, // do not exit on handled exceptions
});

export default Logger;
