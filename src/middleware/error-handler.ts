import { Request, Response, NextFunction } from 'express';
import config from '../config';
import logger from './logging-handler';
import ErrorService, { ErrorType, InternalError } from '../services/error-service';

/**
 * Logs error details with additional context for internal and non-internal errors.
 * @param {Error} err - The error object.
 * @param {Request} req - The HTTP request object.
 */
const logError = (err: Error, req: Request): void => {
  const { originalUrl, method, ip } = req;
  const logMessage = `${err.message} - ${originalUrl} - ${method} - ${ip}`;

  if (err instanceof ErrorService) {
    if (err.type === ErrorType.INTERNAL) {
      logger.error(`500 - ${logMessage}`);
    } else {
      logger.warn(logMessage);
    }
  } else {
    logger.error(`500 - ${logMessage}`);
  }
};

/**
 * Handles custom errors from the ErrorService.
 * @param {ErrorService} err - The custom error object.
 * @param {Response} res - The HTTP response object.
 */
const handleCustomError = (err: ErrorService, res: Response): void => {
  ErrorService.handle(err, res);
};

/**
 * Handles non-custom errors, including different behaviors for development vs. production environments.
 * @param {Error} err - The general error object.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
const handleNonCustomError = (err: Error, req: Request, res: Response): void => {
  logError(err, req); // Log the error

  if (config.server.environment === 'development') {
    logger.error(err.stack);
    res.status(500).json({ error: err.message });
  } else {
    handleCustomError(new InternalError(), res);
  }
};

/**
 * Main error handler middleware.
 * @param {Error} err - The error object that occurred during request processing.
 * @param {Request} req - The incoming HTTP request object.
 * @param {Response} res - The outgoing HTTP response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ErrorService) {
    handleCustomError(err, res);
    logError(err, req);
  } else {
    handleNonCustomError(err, req, res);
  }

  next(err);
};

export default errorHandler;
