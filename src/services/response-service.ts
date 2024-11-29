import { Response } from 'express';
import { RESPONSE_MESSAGES } from '../config/response-config';

enum StatusCode {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
  MANY_REQUESTS = '10004',
}

export enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  MANY_REQUESTS = 429,
  INTERNAL_ERROR = 500,
  ACCESS_TOKEN_INVALID = 498,
}

/**
 * Abstract base class for all response services.
 * It defines common methods and properties for sending API responses.
 */
abstract class ResponseService {
  protected statusCode!: StatusCode; // `Custom Status code for the response
  protected status!: ResponseStatus; // Response status (e.g., success, failure)
  protected message!: string; // Message to be included in the response

  /**
   * Sets the response data (status code, status, and message).
   * @param statusCode - The custom status code for the response.
   * @param status - The HTTP status code (e.g., success, failure).
   * @param message - The message to be included in the response.
   */
  setResponseData(statusCode: StatusCode, status: ResponseStatus, message: string): void {
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
  }

  /**
   * Set custom headers on the response.
   * @param res - The Express response object.
   * @param headers - The headers to be set.
   */
  private setHeaders(res: Response, headers: Record<string, string>) {
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }
  }

  /**
   * Prepares and sends the response with headers and sanitized response data.
   * @param res - The Express response object.
   * @param response - The response object to be sent.
   * @param headers - The headers to be included in the response.
   * @returns The Express response object.
   */
  protected prepare<T extends ResponseService>(
    res: Response,
    response: T,
    headers: { [key: string]: string }
  ): Response {
    this.setHeaders(res, headers);
    return res.status(this.status).json(this.sanitize(response));
  }

  /**
   * Send the response.
   * @param res - The Express response object.
   * @param headers - The headers to be included in the response.
   * @returns The Express response object.
   */
  public send(res: Response, headers: { [key: string]: string } = {}): Response {
    return this.prepare(res, this, headers);
  }

  /**
   * Sanitize the response (remove undefined fields).
   * @param response - The response object to be sanitized.
   * @returns A sanitized response object.
   */
  private sanitize<T extends ResponseService>(response: T): T {
    const clone: T = {} as T;
    Object.assign(clone, response);
    for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
    return clone;
  }
}

/**
 * Response class for handling 'Auth Failure' scenarios.
 */
export class AuthFailureResponse extends ResponseService {
  constructor(message = RESPONSE_MESSAGES[ResponseStatus.UNAUTHORIZED].message) {
    super();
    this.setResponseData(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
  }
}
/**
 * Response class for handling 'Too Many Requests' scenarios.
 */
export class ManyRequestResponse extends ResponseService {
  constructor(message = RESPONSE_MESSAGES[ResponseStatus.MANY_REQUESTS].message) {
    super();
    this.setResponseData(StatusCode.MANY_REQUESTS, ResponseStatus.MANY_REQUESTS, message);
  }
}

/**
 * Response class for handling 'Not Found' scenarios.
 */
export class NotFoundResponse extends ResponseService {
  constructor(message = RESPONSE_MESSAGES[ResponseStatus.NOT_FOUND].message) {
    super();
    this.setResponseData(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare<NotFoundResponse>(res, this, headers);
  }
}

/**
 * Response class for handling 'Forbidden' scenarios.
 */
export class ForbiddenResponse extends ResponseService {
  constructor(message = RESPONSE_MESSAGES[ResponseStatus.FORBIDDEN].message) {
    super();
    this.setResponseData(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
  }
}

/**
 * Response class for handling 'Bad Request' scenarios.
 */
export class BadRequestResponse extends ResponseService {
  constructor(message = RESPONSE_MESSAGES[ResponseStatus.BAD_REQUEST].message) {
    super();
    this.setResponseData(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
  }
}

/**
 * Response class for handling 'Internal Server Error' scenarios.
 */
export class InternalErrorResponse extends ResponseService {
  constructor(message = RESPONSE_MESSAGES[ResponseStatus.INTERNAL_ERROR].message) {
    super();
    this.setResponseData(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
  }
}

/**
 * Response class for sending a success message.
 */
export class SuccessMsgResponse extends ResponseService {
  constructor(message = RESPONSE_MESSAGES[ResponseStatus.SUCCESS].message) {
    super();
    this.setResponseData(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }
}

/**
 * Response class for sending a successful response with data.
 */
export class SuccessResponse<T> extends ResponseService {
  constructor(
    message = RESPONSE_MESSAGES[ResponseStatus.SUCCESS].message,
    private data: T
  ) {
    super();
    this.setResponseData(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare<SuccessResponse<T>>(res, { ...this, data: this.data }, headers);
  }
}

/**
 * Response class for handling invalid access token errors.
 */
export class AccessTokenErrorResponse extends ResponseService {
  private instruction = 'refreshToken';

  constructor(message = RESPONSE_MESSAGES[ResponseStatus.ACCESS_TOKEN_INVALID].message) {
    super();
    this.setResponseData(StatusCode.INVALID_ACCESS_TOKEN, ResponseStatus.UNAUTHORIZED, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    headers.instruction = this.instruction;
    return super.prepare<AccessTokenErrorResponse>(res, this, headers);
  }
}

/**
 * Response class for handling token refresh scenarios.
 */
export class TokenRefreshResponse<T> extends ResponseService {
  private instruction = 'tokenIssued';

  constructor(
    message = RESPONSE_MESSAGES[ResponseStatus.SUCCESS].message,
    private data: T
  ) {
    super();
    this.setResponseData(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    headers.instruction = this.instruction;
    return super.prepare<TokenRefreshResponse<T>>(res, { ...this, data: this.data }, headers);
  }
}
