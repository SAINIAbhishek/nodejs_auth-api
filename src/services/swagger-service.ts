import { Application } from 'express';
import config from '../config';
import swaggerUi from 'swagger-ui-express';
import logger from '../middleware/logging-handler';
import swaggerSpecs from '../swagger-config';

class SwaggerService {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Initializes Swagger in the application if not in production environment.
   */
  public setupSwagger(): void {
    if (config.server.environment !== 'production') {
      const apiDocsPath = `/api-docs/${config.server.apiVersion}`;
      this.app.use(apiDocsPath, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
      logger.info(`Swagger documentation available at: ${apiDocsPath}`);
    } else {
      logger.info('Swagger documentation is disabled in the production environment.');
    }
  }
}

export default SwaggerService;
