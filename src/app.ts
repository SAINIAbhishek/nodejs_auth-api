import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from './routes/v1';
import config from './config';
import errorHandler from './middleware/error-handler';
import { NotFoundError } from './services/error-service';
import { connectToDatabase } from './config/db-config';
import RateLimiterService from './services/rate-limiter-service';
import SwaggerService from './services/swagger-service';

/**
 * Initialize the MongoDB connection
 */
connectToDatabase();

const app = express();

/**
 * This middleware is responsible to apply rate limiting to all requests
 */
app.use(RateLimiterService.ipLimiter);

/**
 * This middleware is responsible to enable cookie parsing
 * commonly used to parse cookies from the incoming HTTP request headers.
 */
app.use(cookieParser());

/**
 * This middleware is a collection of security-related HTTP headers that help
 * protect application against common web vulnerabilities
 */
app.use(helmet());

// This middleware is used to parse incoming JSON payloads in HTTP requests.
app.use(express.json({ limit: config.server.jsonPayloadLimit }));

/**
 * This middleware is used to parse incoming request bodies with urlencoded
 * payloads, such as data submitted through HTML forms.
 */
app.use(
  express.urlencoded({
    limit: config.server.jsonPayloadLimit,
    extended: true,
    parameterLimit: config.server.jsonPayloadParameterLimit,
  })
);

/**
 * This middleware is used to enable Cross-Origin Resource Sharing (CORS)
 * in application.
 * origin: CORS_URL, Allow requests from this origin
 * optionsSuccessStatus: 200, Set the success status for OPTIONS requests
 * credentials: true, Allow credentials (e.g., cookies) to be sent
 */
app.use(cors({ origin: config.cors.allowedOrigins, optionsSuccessStatus: 200, credentials: true }));

/**
 * Api Routes
 */
app.use(`/api/${config.server.apiVersion}`, routes);

/**
 * Swagger Service Initialization
 */
const swaggerService = new SwaggerService(app);
swaggerService.setupSwagger();

/**
 * 404 Not Found Handler
 */
app.use((_req, _res, next) => next(new NotFoundError()));

/**
 * Error Handling Middleware
 */
app.use(errorHandler);

export default app;
