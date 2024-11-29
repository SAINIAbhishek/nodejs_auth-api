"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const winston_1 = require("winston");
const logLevel = config_1.default.server.environment === 'development' ? 'debug' : 'warn';
const directory = config_1.default.logging.directory || path.resolve('logs');
const ensureLogDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};
ensureLogDirectoryExists(directory);
const createFileTransport = (directory, logLevel) => {
    return new winston_daily_rotate_file_1.default({
        level: logLevel,
        filename: path.join(directory, '/%DATE%.log'),
        datePattern: config_1.default.logging.datePattern,
        zippedArchive: true,
        handleExceptions: true,
        maxSize: config_1.default.logging.maxSize,
        maxFiles: config_1.default.logging.maxFiles,
        format: winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.timestamp(), winston_1.format.json()),
    });
};
const fileTransport = createFileTransport(directory, logLevel);
const logger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console({
            level: logLevel,
            format: winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.prettyPrint()),
        }),
        fileTransport,
    ],
    exceptionHandlers: [fileTransport],
    exitOnError: false,
});
exports.default = logger;
