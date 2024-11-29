import swaggerJsdoc from 'swagger-jsdoc';
import { API_VERSION, SERVER_URL } from './config';
import path from 'path';
import Logger from './middleware/Logger';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Node.js Authentication & Authorization Backend application',
    },
    servers: [
      {
        url: `${SERVER_URL}/api/${API_VERSION}`, // the server URL
      },
    ],
  },
  apis: [
    path.resolve(__dirname, `src/routes/${API_VERSION}/**/*.js`),
    path.resolve(__dirname, `src/docs/*.js`),
  ],
};

const specs = swaggerJsdoc(options);

Logger.info(`Swagger Files: ${options.apis}`);

export default specs;
