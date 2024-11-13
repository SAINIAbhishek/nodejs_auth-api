export const ENVIRONMENT = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
export const CORS_URL = process.env.CORS_URL?.split(',') || [];
export const API_VERSION = process.env.API_VERSION;
export const FRONTEND_RESET_URL = process.env.FRONTEND_RESET_URL;
export const MAILTRAP_EMAIL_ENV = process.env.MAILTRAP_EMAIL_ENV || 'testing';

export const DATE_FORMAT = process.env.DATE_FORMAT || 'yyyy-MM-dd';
export const DATE_FULL_FORMAT =
  process.env.DATE_FULL_FORMAT || 'yyyy-MM-dd HH:mm:ss.SSS';

export const MAILTRAP_EMAIL = {
  testing: {
    username: process.env.MAILTRAP_TESTING_USERNAME || '',
    password: process.env.MAILTRAP_TESTING_PASSWORD || '',
    host: process.env.MAILTRAP_TESTING_HOST || '',
    port: parseInt(process.env.MAILTRAP_TESTING_PORT || ''),
  },
  prod: {
    username: process.env.MAILTRAP_USERNAME || '',
    password: process.env.MAILTRAP_PASSWORD || '',
    host: process.env.MAILTRAP_HOST || '',
    port: parseInt(process.env.MAILTRAP_PORT || ''),
  },
};

export const LIMITER = {
  loginWS: parseInt(process.env.LIMITER_LOGIN_WS || '120000'),
  ipWS: parseInt(process.env.LIMITER_IP_WS || '900000'),
  forgotPasswordWS: parseInt(
    process.env.LIMITER_FORGOT_PASSWORD_WS || '120000',
  ),
  loginMaxAttempt: parseInt(process.env.LIMITER_LOGIN_ATTEMPT || '5'),
  ipMaxAttempt: parseInt(process.env.LIMITER_IP_ATTEMPT || '100'),
  forgotPasswordMaxAttempt: parseInt(
    process.env.LIMITER_FORGOT_PASSWORD_ATTEMPT || '2',
  ),
};

export const COOKIE = {
  login: process.env.COOKIE_LOGIN || '',
  maxAge: parseInt(process.env.COOKIE_MAX_AGE_SEC || '0'),
};

export const DB = {
  uri: process.env.DB_URI,
  name: process.env.DB_DATABASE_NAME || '',
  host: process.env.DB_HOST || '',
  username: process.env.DB_USERNAME || '',
  pwd: process.env.DB_PWD || '',
  port: process.env.DB_PORT || '',
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
  connectTimeoutMS: parseInt(process.env.DB_CONNECT_TIMEOUT_MS || '60000'),
  socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT_MS || '45000'),
};

export const TOKEN_INFO = {
  accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
  refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
  passwordResetTokenValidity: parseInt(
    process.env.PASSWORD_RESET_TOKEN_VALIDITY_SEC || '0',
  ),
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET_KEY || '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET_KEY || '',
};

export const LOG_DIRECTORY = process.env.LOG_DIR;
