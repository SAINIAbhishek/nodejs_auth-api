import app from './app';
import config from './config';

const port = config.server.port;

const startServer = () => {
  const server = app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};

// Start the server
startServer();
