import app from './app';
import config from './config';
import mongoose from 'mongoose';
import logger from './middleware/logging-handler';

const port = config.server.port;

const startServer = () => {
  const server = app.listen(port, () => {
    logger.info(`Server is running on port: ${port}`);
  });

  server.on('error', (error) => {
    logger.error(`Server error: ${error.message}`);
  });

  // Graceful shutdown on termination signals
  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}. Initiating server shutdown.`);

    server.close(async (err) => {
      if (err) {
        logger.error(`Error during server shutdown: ${err.message}`);
        process.exit(1); // Exit with an error code if shutdown fails
      } else {
        try {
          await mongoose.disconnect(); // Close database connection
          logger.info('Successfully closed the HTTP server.');
          process.exit(0); // Exit with a success code
        } catch (dbError) {
          logger.error(`Error disconnecting from database: ${(dbError as Error).message}`);
          process.exit(1); // Exit with an error code if DB disconnect fails
        }
      }
    });
  };

  // Listen for termination signals and call the shutdown function
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer();
