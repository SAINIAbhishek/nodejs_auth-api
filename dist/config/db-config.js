"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const roles_script_1 = __importDefault(require("../scripts/roles-script"));
const _1 = __importDefault(require("."));
const logging_handler_1 = __importDefault(require("../middleware/logging-handler"));
const error_service_1 = require("../services/error-service");
const getMongoUrl = () => `${_1.default.db.uri}${_1.default.db.name}`;
const getMongoConfig = () => ({
    minPoolSize: _1.default.db.minPoolSize,
    maxPoolSize: _1.default.db.maxPoolSize,
    connectTimeoutMS: _1.default.db.connectTimeoutMS,
    socketTimeoutMS: _1.default.db.socketTimeoutMS,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const logMongoUrl = (url) => logging_handler_1.default.debug(`Mongodb connection string: ${url}`);
const connectToDatabase = async () => {
    const MONGO_URL = getMongoUrl();
    const MONGO_CONFIG = getMongoConfig();
    logMongoUrl(MONGO_URL);
    try {
        await mongoose_1.default.connect(MONGO_URL, MONGO_CONFIG);
        logging_handler_1.default.info('Mongoose connection established successfully!');
        await (0, roles_script_1.default)();
    }
    catch (err) {
        logging_handler_1.default.info('Mongoose connection failed!');
        logging_handler_1.default.error(err);
        throw new error_service_1.InternalError('MongoDB connection error');
    }
};
exports.connectToDatabase = connectToDatabase;
const connection = mongoose_1.default.connection;
exports.default = connection;
