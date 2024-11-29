import { Config } from '../types/config-type';

const config: Config = {
  server: {
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001'),
    url: process.env.SERVER_URL || 'http://localhost:3001',
    apiVersion: process.env.API_VERSION || 'v1',
    emailEnv: process.env.MAILTRAP_EMAIL_ENV || 'testing',
  },
  cors: {
    allowedOrigins: process.env.CORS_URL?.split(',') || ['http://localhost:3000'],
  },
  frontend: {
    resetUrl: process.env.FRONTEND_RESET_URL || 'http://localhost:3000/',
  },
  date: {
    format: process.env.DATE_FORMAT || 'yyyy-MM-dd',
    fullFormat: process.env.DATE_FULL_FORMAT || 'yyyy-MM-dd HH:mm:ss.SSS',
  },
  mailtrap: {
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
  },
  limiter: {
    loginWS: parseInt(process.env.LIMITER_LOGIN_WS || '120000'),
    ipWS: parseInt(process.env.LIMITER_IP_WS || '900000'),
    forgotPasswordWS: parseInt(process.env.LIMITER_FORGOT_PASSWORD_WS || '120000'),
    loginMaxAttempt: parseInt(process.env.LIMITER_LOGIN_ATTEMPT || '5'),
    ipMaxAttempt: parseInt(process.env.LIMITER_IP_ATTEMPT || '100'),
    forgotPasswordMaxAttempt: parseInt(process.env.LIMITER_FORGOT_PASSWORD_ATTEMPT || '2'),
  },
  cookie: {
    login: process.env.COOKIE_LOGIN || 'rememberme',
    maxAge: parseInt(process.env.COOKIE_MAX_AGE_SEC || '0'),
  },
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/',
    name: process.env.DB_DATABASE_NAME || 'node-db-v1',
    host: process.env.DB_HOST || '127.0.0.1',
    username: process.env.DB_USERNAME || 'nodeApplicationUser',
    password: process.env.DB_PWD || '123456789',
    port: parseInt(process.env.DB_PORT || '27017'),
    minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
    connectTimeoutMS: parseInt(process.env.DB_CONNECT_TIMEOUT_MS || '60000'),
    socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT_MS || '45000'),
  },
  token: {
    accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
    refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
    passwordResetTokenValidity: parseInt(process.env.PASSWORD_RESET_TOKEN_VALIDITY_SEC || '0'),
    issuer: process.env.TOKEN_ISSUER || 'api.dev.saini.com',
    audience: process.env.TOKEN_AUDIENCE || 'dev.saini.com',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET_KEY || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET_KEY || '',
  },
  logging: {
    directory: process.env.LOG_DIR || 'logs',
    datePattern: process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD-HH',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
  },
};

export default config;
