import mongoose from 'mongoose';
import config from '.';
import logger from '../middleware/logging-handler';
import { InternalError } from '../services/error-service';
import initializeRoles from '../scripts/role-script';

/**
 * MongoDB connection string
 * @returns The MongoDB connection string.
 */
const getMongoUrl = (): string => `${config.db.uri}${config.db.name}`;

/**
 * MongoDB connection options
 * @returns An object containing the MongoDB connection options.
 */
const getMongoConfig = () => ({
  minPoolSize: config.db.minPoolSize, // Minimum number of connections in the pool
  maxPoolSize: config.db.maxPoolSize, // Maximum number of connections in the pool
  connectTimeoutMS: config.db.connectTimeoutMS, // Timeout for initial connection (ms)
  socketTimeoutMS: config.db.socketTimeoutMS, // Timeout for socket inactivity (ms)
  useNewUrlParser: true, // Use new MongoDB URL parser
  useUnifiedTopology: true, // Use the new server discovery and monitoring engine
});

/**
 * Log the MongoDB URL for debugging purposes
 * @param url The MongoDB connection string.
 * @returns
 */
const logMongoUrl = (url: string) => logger.debug(`Mongodb connection string: ${url}`);

/**
 * Function to initialize the MongoDB connection
 * @throws {InternalError} If the MongoDB connection fails.
 */
export const connectToDatabase = async (): Promise<void> => {
  const MONGO_URL = getMongoUrl();
  const MONGO_CONFIG = getMongoConfig();

  logMongoUrl(MONGO_URL);

  try {
    await mongoose.connect(MONGO_URL, MONGO_CONFIG);
    logger.info('Mongoose connection established successfully!');
    await initializeRoles(); // Initialize roles after successful connection
  } catch (err) {
    logger.info('Mongoose connection failed!');
    logger.error(err);
    throw new InternalError('MongoDB connection error');
  }
};

const connection = mongoose.connection;
export default connection;
