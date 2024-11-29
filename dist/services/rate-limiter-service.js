"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const rate_limiter_handler_1 = __importDefault(require("../middleware/rate-limiter-handler"));
class RateLimiterService {
    constructor() {
        this.forgotPasswordLimiter = (0, rate_limiter_handler_1.default)({
            windowMs: config_1.default.limiter.forgotPasswordWS,
            max: config_1.default.limiter.forgotPasswordMaxAttempt,
            message: 'Too many reset password attempts, please try again later.',
        });
        this.loginLimiter = (0, rate_limiter_handler_1.default)({
            windowMs: config_1.default.limiter.loginWS,
            max: config_1.default.limiter.loginMaxAttempt,
            message: 'Too many login attempts, please try again later.',
        });
        this.ipLimiter = (0, rate_limiter_handler_1.default)({
            windowMs: config_1.default.limiter.ipWS,
            max: config_1.default.limiter.ipMaxAttempt,
            message: 'Too many requests, please try again later.',
        });
    }
}
exports.default = new RateLimiterService();
