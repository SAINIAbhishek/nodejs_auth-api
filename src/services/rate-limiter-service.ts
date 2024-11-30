import config from '../config';
import createRateLimiter from '../middleware/rate-limiter-handler';

class RateLimiterService {
  /**
   * Rate limiter for the 'forgot password' route.
   * It prevents excessive password reset attempts within a given time frame.
   */
  forgotPasswordLimiter = createRateLimiter({
    windowMs: config.limiter.forgotPasswordWS,
    max: config.limiter.forgotPasswordMaxAttempt,
    message: 'Too many reset password attempts, please try again later.',
  });

  /**
   * Rate limiter for the 'login' route.
   * It helps prevent brute force attacks by limiting the number of login attempts.
   */
  loginLimiter = createRateLimiter({
    windowMs: config.limiter.loginWS,
    max: config.limiter.loginMaxAttempt,
    message: 'Too many login attempts, please try again later.',
  });

  /**
   * General IP-based rate limiter for all requests.
   * It limits the number of requests a user can make from a specific IP within a given time frame.
   */
  ipLimiter = createRateLimiter({
    windowMs: config.limiter.ipWS,
    max: config.limiter.ipMaxAttempt,
    message: 'Too many requests, please try again later.',
  });
}

export default new RateLimiterService();
