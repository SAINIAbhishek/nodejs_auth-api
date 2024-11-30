type mailtrap = {
  username: string;
  password: string;
  host: string;
  port: number;
};

type server = {
  environment: string;
  port: number;
  url: string;
  apiVersion: string;
  emailEnv: string;
  jsonPayloadLimit: string;
  jsonPayloadParameterLimit: number;
};

type limiter = {
  loginWS: number;
  ipWS: number;
  forgotPasswordWS: number;
  loginMaxAttempt: number;
  ipMaxAttempt: number;
  forgotPasswordMaxAttempt: number;
};

type db = {
  uri: string;
  name: string;
  host: string;
  username: string;
  port: number;
  password: string;
  minPoolSize: number;
  maxPoolSize: number;
  connectTimeoutMS: number;
  socketTimeoutMS: number;
};

type token = {
  accessTokenValidity: number;
  refreshTokenValidity: number;
  passwordResetTokenValidity: number;
  issuer: string;
  audience: string;
  accessTokenSecret: string;
  refreshTokenSecret: string;
};

type logging = {
  directory: string;
  maxSize: string;
  maxFiles: string;
  datePattern: string;
};

export type Config = {
  server: server;
  cors: {
    allowedOrigins: string[];
  };
  frontend: {
    resetUrl: string;
  };
  mailtrap: {
    testing: mailtrap;
    prod: mailtrap;
  };
  date: {
    format: string;
    fullFormat: string;
  };
  limiter: limiter;
  cookie: {
    login: string;
    maxAge: number;
  };
  db: db;
  token: token;
  logging: logging;
};
