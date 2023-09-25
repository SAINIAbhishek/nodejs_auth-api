// A structured way to handle different types of API responses with consistent
// status codes, messages, and headers. To ensure uniformity in API responses
// across the application.

import { Response } from 'express';

enum StatusCode {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
  MANY_REQUESTS = '10004',
}

enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  MANY_REQUESTS = 429,
  INTERNAL_ERROR = 500,
}

abstract class ApiResponse {
  protected constructor(
    protected statusCode: StatusCode,
    protected status: ResponseStatus,
    protected message: string
  ) {}

  protected prepare<T extends ApiResponse>(
    res: Response,
    response: T,
    headers: { [key: string]: string }
  ): Response {
    for (const [key, value] of Object.entries(headers)) res.append(key, value);
    return res.status(this.status).json(ApiResponse.sanitize(response));
  }

  public send(
    res: Response,
    headers: { [key: string]: string } = {}
  ): Response {
    return this.prepare<ApiResponse>(res, this, headers);
  }

  private static sanitize<T extends ApiResponse>(response: T): T {
    const clone: T = {} as T;
    Object.assign(clone, response);
    // @ts-ignore
    delete clone.status;
    for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
    return clone;
  }
}

export class AuthFailureResponse extends ApiResponse {
  constructor(message = 'Authentication Failure') {
    super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
  }
}

export class ManyRequestResponse extends ApiResponse {
  constructor(message = 'Too Many Requests') {
    super(StatusCode.MANY_REQUESTS, ResponseStatus.MANY_REQUESTS, message);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(message = 'Not Found') {
    super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare<NotFoundResponse>(res, this, headers);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(message = 'Forbidden') {
    super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message = 'Bad Parameters') {
    super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(message = 'Internal Error') {
    super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
  }
}

export class SuccessMsgResponse extends ApiResponse {
  constructor(message = 'Success') {
    super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }
}

export class FailureMsgResponse extends ApiResponse {
  constructor(message = 'Failure') {
    super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message);
  }
}

export class SuccessResponse<T> extends ApiResponse {
  constructor(message = 'Success', private data: T) {
    super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare<SuccessResponse<T>>(res, this, headers);
  }
}

export class AccessTokenErrorResponse extends ApiResponse {
  private instruction = 'refreshToken';

  constructor(message = 'Access token invalid') {
    super(
      StatusCode.INVALID_ACCESS_TOKEN,
      ResponseStatus.UNAUTHORIZED,
      message
    );
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    headers.instruction = this.instruction;
    return super.prepare<AccessTokenErrorResponse>(res, this, headers);
  }
}

export class TokenRefreshResponse extends ApiResponse {
  constructor(message = 'Token Issued', private token: string) {
    super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare<TokenRefreshResponse>(res, this, headers);
  }
}
