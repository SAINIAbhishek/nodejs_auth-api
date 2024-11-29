"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const response_service_1 = require("../services/response-service");
const logging_handler_1 = __importDefault(require("./logging-handler"));
const createRateLimiter = ({ windowMs, max, message }) => (0, express_rate_limit_1.default)({
    windowMs,
    max,
    message,
    handler: (req, res, _next, options) => {
        logging_handler_1.default.info(`${options.message}, Method: ${req.method}, Url: ${req.url}`);
        new response_service_1.ManyRequestResponse(options.message).send(res);
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.default = createRateLimiter;
