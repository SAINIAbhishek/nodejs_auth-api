"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenError = exports.NoDataError = exports.TokenExpiredError = exports.BadTokenError = exports.NoEntryError = exports.ForbiddenError = exports.NotFoundError = exports.BadRequestError = exports.InternalError = exports.AuthFailureError = exports.ErrorType = void 0;
const response_service_1 = require("./response-service");
const config_1 = __importDefault(require("../config"));
const error_config_1 = require("../config/error-config");
var ErrorType;
(function (ErrorType) {
    ErrorType["BAD_TOKEN"] = "Bad Token Error";
    ErrorType["TOKEN_EXPIRED"] = "Token Expired Error";
    ErrorType["UNAUTHORIZED"] = "Authentication Failure Error";
    ErrorType["ACCESS_TOKEN"] = "Access Token Error";
    ErrorType["INTERNAL"] = "Internal Error";
    ErrorType["NOT_FOUND"] = "Not Found Error";
    ErrorType["NO_ENTRY"] = "No Entry Error";
    ErrorType["NO_DATA"] = "No Data Error";
    ErrorType["BAD_REQUEST"] = "Bad Request Error";
    ErrorType["FORBIDDEN"] = "Forbidden Error";
    ErrorType["MANY_REQUESTS"] = "Too Many Requests";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
class ErrorService extends Error {
    constructor(type, message = 'error') {
        super(type);
        this.type = type;
        this.message = message;
    }
}
ErrorService.handle = (err, res) => {
    switch (err.type) {
        case ErrorType.BAD_TOKEN:
        case ErrorType.TOKEN_EXPIRED:
        case ErrorType.UNAUTHORIZED:
            return new response_service_1.AuthFailureResponse(err.message).send(res);
        case ErrorType.ACCESS_TOKEN:
            return new response_service_1.AccessTokenErrorResponse(err.message).send(res);
        case ErrorType.INTERNAL:
            return new response_service_1.InternalErrorResponse(err.message).send(res);
        case ErrorType.NOT_FOUND:
        case ErrorType.NO_ENTRY:
        case ErrorType.NO_DATA:
            return new response_service_1.NotFoundResponse(err.message).send(res);
        case ErrorType.BAD_REQUEST:
            return new response_service_1.BadRequestResponse(err.message).send(res);
        case ErrorType.FORBIDDEN:
            return new response_service_1.ForbiddenResponse(err.message).send(res);
        case ErrorType.MANY_REQUESTS:
            return new response_service_1.ManyRequestResponse(err.message).send(res);
        default: {
            let message = err.message;
            if (config_1.default.server.environment === 'production') {
                message = 'Something wrong happened.';
            }
            return new response_service_1.InternalErrorResponse(message).send(res);
        }
    }
};
class AuthFailureError extends ErrorService {
    constructor(message = error_config_1.ERROR_MESSAGES[ErrorType.UNAUTHORIZED].message) {
        super(ErrorType.UNAUTHORIZED, message);
    }
}
exports.AuthFailureError = AuthFailureError;
class InternalError extends ErrorService {
    constructor(message = error_config_1.ERROR_MESSAGES[ErrorType.INTERNAL].message) {
        super(ErrorType.INTERNAL, message);
    }
}
exports.InternalError = InternalError;
class BadRequestError extends ErrorService {
    constructor(message = error_config_1.ERROR_MESSAGES[ErrorType.BAD_REQUEST].message) {
        super(ErrorType.BAD_REQUEST, message);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends ErrorService {
    constructor(message = error_config_1.ERROR_MESSAGES[ErrorType.NOT_FOUND].message) {
        super(ErrorType.NOT_FOUND, message);
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends ErrorService {
    constructor(message = error_config_1.ERROR_MESSAGES[ErrorType.FORBIDDEN].message) {
        super(ErrorType.FORBIDDEN, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class NoEntryError extends ErrorService {
    constructor(message = error_config_1.ERROR_MESSAGES[ErrorType.NO_ENTRY].message) {
        super(ErrorType.NO_ENTRY, message);
    }
}
exports.NoEntryError = NoEntryError;
class BadTokenError extends ErrorService {
    constructor(message = error_config_1.ERROR_MESSAGES[ErrorType.BAD_TOKEN].message) {
        super(ErrorType.BAD_TOKEN, message);
    }
}
exports.BadTokenError = BadTokenError;
class TokenExpiredError extends ErrorService {
    constructor(message = error_config_1.ERROR_MESSAGES[ErrorType.TOKEN_EXPIRED].message) {
        super(ErrorType.TOKEN_EXPIRED, message);
    }
}
exports.TokenExpiredError = TokenExpiredError;
class NoDataError extends ErrorService {
    constructor(message = error_config_1.ERROR_MESSAGES[ErrorType.NO_DATA].message) {
        super(ErrorType.NO_DATA, message);
    }
}
exports.NoDataError = NoDataError;
class AccessTokenError extends ErrorService {
    constructor(message = error_config_1.ERROR_MESSAGES[ErrorType.ACCESS_TOKEN].message) {
        super(ErrorType.ACCESS_TOKEN, message);
    }
}
exports.AccessTokenError = AccessTokenError;
exports.default = ErrorService;
