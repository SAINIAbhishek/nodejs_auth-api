"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRefreshResponse = exports.AccessTokenErrorResponse = exports.SuccessResponse = exports.SuccessMsgResponse = exports.InternalErrorResponse = exports.BadRequestResponse = exports.ForbiddenResponse = exports.NotFoundResponse = exports.ManyRequestResponse = exports.AuthFailureResponse = exports.ResponseStatus = void 0;
const response_config_1 = require("../config/response-config");
var StatusCode;
(function (StatusCode) {
    StatusCode["SUCCESS"] = "10000";
    StatusCode["FAILURE"] = "10001";
    StatusCode["RETRY"] = "10002";
    StatusCode["INVALID_ACCESS_TOKEN"] = "10003";
    StatusCode["MANY_REQUESTS"] = "10004";
})(StatusCode || (StatusCode = {}));
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["SUCCESS"] = 200] = "SUCCESS";
    ResponseStatus[ResponseStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ResponseStatus[ResponseStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ResponseStatus[ResponseStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    ResponseStatus[ResponseStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    ResponseStatus[ResponseStatus["MANY_REQUESTS"] = 429] = "MANY_REQUESTS";
    ResponseStatus[ResponseStatus["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    ResponseStatus[ResponseStatus["ACCESS_TOKEN_INVALID"] = 498] = "ACCESS_TOKEN_INVALID";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
class ResponseService {
    setResponseData(statusCode, status, message) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
    }
    setHeaders(res, headers) {
        for (const [key, value] of Object.entries(headers)) {
            res.setHeader(key, value);
        }
    }
    prepare(res, response, headers) {
        this.setHeaders(res, headers);
        return res.status(this.status).json(this.sanitize(response));
    }
    send(res, headers = {}) {
        return this.prepare(res, this, headers);
    }
    sanitize(response) {
        const clone = {};
        Object.assign(clone, response);
        for (const i in clone)
            if (typeof clone[i] === 'undefined')
                delete clone[i];
        return clone;
    }
}
class AuthFailureResponse extends ResponseService {
    constructor(message = response_config_1.RESPONSE_MESSAGES[ResponseStatus.UNAUTHORIZED].message) {
        super();
        this.setResponseData(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
    }
}
exports.AuthFailureResponse = AuthFailureResponse;
class ManyRequestResponse extends ResponseService {
    constructor(message = response_config_1.RESPONSE_MESSAGES[ResponseStatus.MANY_REQUESTS].message) {
        super();
        this.setResponseData(StatusCode.MANY_REQUESTS, ResponseStatus.MANY_REQUESTS, message);
    }
}
exports.ManyRequestResponse = ManyRequestResponse;
class NotFoundResponse extends ResponseService {
    constructor(message = response_config_1.RESPONSE_MESSAGES[ResponseStatus.NOT_FOUND].message) {
        super();
        this.setResponseData(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
    }
    send(res, headers = {}) {
        return super.prepare(res, this, headers);
    }
}
exports.NotFoundResponse = NotFoundResponse;
class ForbiddenResponse extends ResponseService {
    constructor(message = response_config_1.RESPONSE_MESSAGES[ResponseStatus.FORBIDDEN].message) {
        super();
        this.setResponseData(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
    }
}
exports.ForbiddenResponse = ForbiddenResponse;
class BadRequestResponse extends ResponseService {
    constructor(message = response_config_1.RESPONSE_MESSAGES[ResponseStatus.BAD_REQUEST].message) {
        super();
        this.setResponseData(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
    }
}
exports.BadRequestResponse = BadRequestResponse;
class InternalErrorResponse extends ResponseService {
    constructor(message = response_config_1.RESPONSE_MESSAGES[ResponseStatus.INTERNAL_ERROR].message) {
        super();
        this.setResponseData(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
    }
}
exports.InternalErrorResponse = InternalErrorResponse;
class SuccessMsgResponse extends ResponseService {
    constructor(message = response_config_1.RESPONSE_MESSAGES[ResponseStatus.SUCCESS].message) {
        super();
        this.setResponseData(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
    }
}
exports.SuccessMsgResponse = SuccessMsgResponse;
class SuccessResponse extends ResponseService {
    constructor(message = response_config_1.RESPONSE_MESSAGES[ResponseStatus.SUCCESS].message, data) {
        super();
        this.data = data;
        this.setResponseData(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
    }
    send(res, headers = {}) {
        return super.prepare(res, { ...this, data: this.data }, headers);
    }
}
exports.SuccessResponse = SuccessResponse;
class AccessTokenErrorResponse extends ResponseService {
    constructor(message = response_config_1.RESPONSE_MESSAGES[ResponseStatus.ACCESS_TOKEN_INVALID].message) {
        super();
        this.instruction = 'refreshToken';
        this.setResponseData(StatusCode.INVALID_ACCESS_TOKEN, ResponseStatus.UNAUTHORIZED, message);
    }
    send(res, headers = {}) {
        headers.instruction = this.instruction;
        return super.prepare(res, this, headers);
    }
}
exports.AccessTokenErrorResponse = AccessTokenErrorResponse;
class TokenRefreshResponse extends ResponseService {
    constructor(message = response_config_1.RESPONSE_MESSAGES[ResponseStatus.SUCCESS].message, data) {
        super();
        this.data = data;
        this.instruction = 'tokenIssued';
        this.setResponseData(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
    }
    send(res, headers = {}) {
        headers.instruction = this.instruction;
        return super.prepare(res, { ...this, data: this.data }, headers);
    }
}
exports.TokenRefreshResponse = TokenRefreshResponse;
