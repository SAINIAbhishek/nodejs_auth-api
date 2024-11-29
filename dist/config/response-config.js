"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE_MESSAGES = void 0;
const response_service_1 = require("../services/response-service");
exports.RESPONSE_MESSAGES = {
    [response_service_1.ResponseStatus.UNAUTHORIZED]: { message: 'Authentication Failure' },
    [response_service_1.ResponseStatus.MANY_REQUESTS]: { message: 'Too Many Requests' },
    [response_service_1.ResponseStatus.NOT_FOUND]: { message: 'Not Found' },
    [response_service_1.ResponseStatus.FORBIDDEN]: { message: 'Forbidden' },
    [response_service_1.ResponseStatus.BAD_REQUEST]: { message: 'Bad Request' },
    [response_service_1.ResponseStatus.INTERNAL_ERROR]: { message: 'Internal Server' },
    [response_service_1.ResponseStatus.SUCCESS]: { message: 'Success' },
    [response_service_1.ResponseStatus.ACCESS_TOKEN_INVALID]: { message: 'Access token invalid' },
};
