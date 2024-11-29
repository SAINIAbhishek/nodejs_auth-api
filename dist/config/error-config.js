"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = void 0;
const error_service_1 = require("../services/error-service");
exports.ERROR_MESSAGES = {
    [error_service_1.ErrorType.BAD_TOKEN]: { message: 'Invalid token' },
    [error_service_1.ErrorType.TOKEN_EXPIRED]: { message: 'Token has expired' },
    [error_service_1.ErrorType.UNAUTHORIZED]: { message: 'Invalid credentials' },
    [error_service_1.ErrorType.ACCESS_TOKEN]: { message: 'Invalid access token' },
    [error_service_1.ErrorType.INTERNAL]: { message: 'Internal server error' },
    [error_service_1.ErrorType.NOT_FOUND]: { message: 'Resource not found' },
    [error_service_1.ErrorType.NO_ENTRY]: { message: 'No entry exists' },
    [error_service_1.ErrorType.NO_DATA]: { message: 'No data available' },
    [error_service_1.ErrorType.BAD_REQUEST]: { message: 'Bad request' },
    [error_service_1.ErrorType.FORBIDDEN]: { message: 'Access forbidden' },
    [error_service_1.ErrorType.MANY_REQUESTS]: { message: 'Too many requests' },
};
