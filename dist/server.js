"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logging_handler_1 = __importDefault(require("./middleware/logging-handler"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const port = config_1.default.server.port;
const startServer = () => {
    logging_handler_1.default.info(`Server running on port: ${port}`);
    const server = app_1.default.listen(port, () => {
        logging_handler_1.default.info(`Server running on port: ${port}`);
    });
    server.on('error', (error) => {
        logging_handler_1.default.error(`Server error: ${error.message}`);
    });
    const shutdown = (signal) => {
        logging_handler_1.default.info(`Received ${signal}. Closing HTTP server.`);
        server.close(async (err) => {
            if (err) {
                logging_handler_1.default.error(`Error during server shutdown: ${err.message}`);
                process.exit(1);
            }
            else {
                try {
                    await mongoose_1.default.disconnect();
                    logging_handler_1.default.info('Successfully closed the HTTP server.');
                    process.exit(0);
                }
                catch (dbError) {
                    logging_handler_1.default.error(`Error disconnecting from database: ${dbError.message}`);
                    process.exit(1);
                }
            }
        });
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
};
(function initEnv() {
    logging_handler_1.default.info(`Server running on port: ${port}`);
})();
startServer();
