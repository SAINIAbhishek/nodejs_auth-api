export const ENVIRONMENT = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const CORS_URL = process.env.CORS_URL;
export const API_VERSION = process.env.API_VERSION;

export const COOKIE = {
  login: process.env.COOKIE_LOGIN || '',
  maxAge: parseInt(process.env.COOKIE_MAX_AGE_SEC || '0'),
};

export const DB = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
  connectTimeoutMS: parseInt(process.env.DB_CONNECT_TIMEOUT_MS || '60000'),
  socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT_MS || '45000'),
};

export const TOKEN_INFO = {
  accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
  refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET_KEY || '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET_KEY || '',
};

export const LOG_DIRECTORY = process.env.LOG_DIR;
