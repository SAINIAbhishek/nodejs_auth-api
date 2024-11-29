import { Response } from 'express';
import {
  AuthFailureResponse,
  AccessTokenErrorResponse,
  InternalErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
  ForbiddenResponse,
  ManyRequestResponse,
} from './response-service';
import config from '../config';
import { ERROR_MESSAGES } from '../config/error-config';

export enum ErrorType {
  BAD_TOKEN = 'Bad Token Error',
  TOKEN_EXPIRED = 'Token Expired Error',
  UNAUTHORIZED = 'Authentication Failure Error',
  ACCESS_TOKEN = 'Access Token Error',
  INTERNAL = 'Internal Error',
  NOT_FOUND = 'Not Found Error',
  NO_ENTRY = 'No Entry Error',
  NO_DATA = 'No Data Error',
  BAD_REQUEST = 'Bad Request Error',
  FORBIDDEN = 'Forbidden Error',
  MANY_REQUESTS = 'Too Many Requests',
}

/**
 * Abstract base class for custom error handling.
 * Extends the built-in Error class to include error type and message.
 */
abstract class ErrorService extends Error {
  /**
   * Constructor for initializing the error with a specific type and message.
   * @param {ErrorType} type - The type of error.
   * @param {string} message - The error message (default is 'error').
   */
  protected constructor(
    public type: ErrorType,
    public message = 'error'
  ) {
    super(type);
  }

  /**
   * Static method to handle the error and send an appropriate response to the client.
   * @param {ErrorService} err - The error instance.
   * @param {Response} res - The Express response object.
   * @returns {Response} - The response with the error message sent to the client.
   */
  static handle = (err: ErrorService, res: Response): Response => {
    switch (err.type) {
      case ErrorType.BAD_TOKEN:
      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(err.message).send(res); // Unauthorized error responses

      case ErrorType.ACCESS_TOKEN:
        return new AccessTokenErrorResponse(err.message).send(res); // Access token error responses

      case ErrorType.INTERNAL:
        return new InternalErrorResponse(err.message).send(res); // Internal error responses

      case ErrorType.NOT_FOUND:
      case ErrorType.NO_ENTRY:
      case ErrorType.NO_DATA:
        return new NotFoundResponse(err.message).send(res); // Not found error responses

      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message).send(res); // Bad request error responses

      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(err.message).send(res); // Forbidden error responses

      case ErrorType.MANY_REQUESTS:
        return new ManyRequestResponse(err.message).send(res); // Too many requests error responses

      default: {
        let message = err.message;

        // In production, hide detailed error messages and provide a generic message
        if (config.server.environment === 'production') {
          message = 'Something wrong happened.';
        }
        return new InternalErrorResponse(message).send(res); // Default to internal error response
      }
    }
  };
}

/**
 * Error class for handling authentication failure (Unauthorized).
 */
export class AuthFailureError extends ErrorService {
  constructor(message = ERROR_MESSAGES[ErrorType.UNAUTHORIZED].message) {
    super(ErrorType.UNAUTHORIZED, message);
  }
}

/**
 * Error class for handling internal server errors.
 */
export class InternalError extends ErrorService {
  constructor(message = ERROR_MESSAGES[ErrorType.INTERNAL].message) {
    super(ErrorType.INTERNAL, message);
  }
}

/**
 * Error class for handling bad request errors.
 */
export class BadRequestError extends ErrorService {
  constructor(message = ERROR_MESSAGES[ErrorType.BAD_REQUEST].message) {
    super(ErrorType.BAD_REQUEST, message);
  }
}

/**
 * Error class for handling not found errors.
 */
export class NotFoundError extends ErrorService {
  constructor(message = ERROR_MESSAGES[ErrorType.NOT_FOUND].message) {
    super(ErrorType.NOT_FOUND, message);
  }
}

/**
 * Error class for handling forbidden errors.
 */
export class ForbiddenError extends ErrorService {
  constructor(message = ERROR_MESSAGES[ErrorType.FORBIDDEN].message) {
    super(ErrorType.FORBIDDEN, message);
  }
}

/**
 * Error class for handling no entry found errors.
 */
export class NoEntryError extends ErrorService {
  constructor(message = ERROR_MESSAGES[ErrorType.NO_ENTRY].message) {
    super(ErrorType.NO_ENTRY, message);
  }
}

/**
 * Error class for handling bad token errors.
 */
export class BadTokenError extends ErrorService {
  constructor(message = ERROR_MESSAGES[ErrorType.BAD_TOKEN].message) {
    super(ErrorType.BAD_TOKEN, message);
  }
}

/**
 * Error class for handling token expired errors.
 */
export class TokenExpiredError extends ErrorService {
  constructor(message = ERROR_MESSAGES[ErrorType.TOKEN_EXPIRED].message) {
    super(ErrorType.TOKEN_EXPIRED, message);
  }
}

/**
 * Error class for handling no data found errors.
 */
export class NoDataError extends ErrorService {
  constructor(message = ERROR_MESSAGES[ErrorType.NO_DATA].message) {
    super(ErrorType.NO_DATA, message);
  }
}

/**
 * Error class for handling access token errors.
 */
export class AccessTokenError extends ErrorService {
  constructor(message = ERROR_MESSAGES[ErrorType.ACCESS_TOKEN].message) {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}

export default ErrorService;
