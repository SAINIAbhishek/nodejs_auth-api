import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import config from './config';

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
        url: `${config.server.url}/api/${config.server.apiVersion}`, // the server URL
      },
    ],
  },
  apis: [
    path.resolve(__dirname, `./routes/${config.server.apiVersion}/**/*.js`),
    path.resolve(__dirname, `./swagger-docs/**/*.js`),
  ],
};

const swaggerSpecs = swaggerJsdoc(options);

export default swaggerSpecs;
