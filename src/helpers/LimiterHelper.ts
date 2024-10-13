import rateLimit from 'express-rate-limit';
import Logger from '../middleware/Logger';
import { ManyRequestResponse } from '../middleware/ApiResponse';

const createRateLimiter = ({
  windowMs,
  max,
  message,
}: {
  windowMs: number;
  max: number;
  message: string;
}) =>
  rateLimit({
    windowMs,
    max,
    message,
    handler: (req, res, _, options) => {
      Logger.info(`${options.message}, Method: ${req.method}, Url: ${req.url}`);
      new ManyRequestResponse(options.message).send(res);
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

export default {
  createRateLimiter,
};
