import express, { NextFunction, Request, Response } from 'express';
import Logger from './middleware/Logger';
import { API_VERSION, CORS_URL, ENVIRONMENT } from './config';
import cors from 'cors';
import helmet from 'helmet';
import './config/DatabaseConfig'; // initialize database
import cookieParser from 'cookie-parser';
import {
  ApiError,
  ErrorType,
  InternalError,
  NotFoundError,
} from './middleware/ApiError';
import routes from './routes/v1';

process.on('uncaughtException', (e) => {
  Logger.error(e);
});

const app = express();

// This middleware is responsible to enable cookie parsing
// commonly used to parse cookies from the incoming HTTP request headers.
app.use(cookieParser());

// This middleware is a collection of security-related HTTP headers that help
// protect application against common web vulnerabilities
app.use(helmet());

// This middleware is used to parse incoming JSON payloads in HTTP requests.
app.use(express.json({ limit: '10mb' }));

// This middleware is used to parse incoming request bodies with urlencoded
// payloads, such as data submitted through HTML forms.
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 })
);

// This middleware is used to enable Cross-Origin Resource Sharing (CORS)
// in application.
// origin: CORS_URL, Allow requests from this origin
// optionsSuccessStatus: 200, Set the success status for OPTIONS requests
// credentials: true, Allow credentials (e.g., cookies) to be sent
app.use(
  cors({ origin: CORS_URL, optionsSuccessStatus: 200, credentials: true })
);

// Api Routes
app.use(`/api/${API_VERSION}`, routes);

// The middleware function is executed for all incoming requests that don't
// match any of the routes defined earlier.
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);

    if (err.type === ErrorType.INTERNAL)
      Logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
  } else {
    Logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );

    if (ENVIRONMENT === 'development') {
      Logger.error(err);
      res.status(500).json({ error: err.message });
    } else {
      ApiError.handle(new InternalError(), res);
    }
  }
});

export default app;
