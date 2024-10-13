import app from './app';
import Logger from './middleware/Logger';
import { PORT } from './config';

const startServer = () => {
  const server = app.listen(PORT, () => {
    Logger.info(`Server running on port: ${PORT}`);
  });

  // Handle server errors
  server.on('error', (error) => {
    Logger.error(`Server error: ${error.message}`);
  });

  // Graceful shutdown on termination signals
  const shutdown = (signal: string) => {
    Logger.info(`Received ${signal}. Closing HTTP server.`);
    server.close((err) => {
      if (err) {
        Logger.error(`Error closing server: ${err.message}`);
      } else {
        Logger.info('HTTP server closed successfully.');
      }
      process.exit(err ? 1 : 0); // Exit with error code if there's an error
    });
  };

  // Listen for termination signals
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

// Start the server
startServer();
