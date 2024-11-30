import rateLimit from 'express-rate-limit';
import { ManyRequestResponse } from '../services/response-service';
import logger from './logging-handler';

type Limiter = {
  windowMs: number;
  max: number;
  message: string;
};

/**
 * Creates a rate limiter with configurable window and request limit.
 * @param {Object} params - The configuration parameters for the rate limiter.
 * @param {number} params.windowMs - Time window for the rate limit in milliseconds.
 * @param {number} params.max - Maximum number of requests allowed in the time window.
 * @param {string} params.message - The message to return when rate limit is exceeded.
 * @returns {rateLimit.RateLimit} - The configured rate limiter middleware.
 */
const createRateLimiter = ({ windowMs, max, message }: Limiter) =>
  rateLimit({
    windowMs, // Time window in milliseconds
    max, // Maximum requests allowed within the window
    message, // Custom message when the limit is exceeded
    handler: (req, res, _next, options) => {
      logger.info(`${options.message}, Method: ${req.method}, Url: ${req.url}`);
      new ManyRequestResponse(options.message).send(res);
    },
    standardHeaders: true, // Include rate limit info in response headers
    legacyHeaders: false, // Disable legacy headers
  });

export default createRateLimiter;
