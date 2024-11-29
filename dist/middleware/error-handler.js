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
const logging_handler_1 = __importDefault(require("./logging-handler"));
const error_service_1 = __importStar(require("../services/error-service"));
const logError = (err, req) => {
    const { originalUrl, method, ip } = req;
    const logMessage = `${err.message} - ${originalUrl} - ${method} - ${ip}`;
    if (err instanceof error_service_1.default) {
        if (err.type === error_service_1.ErrorType.INTERNAL) {
            logging_handler_1.default.error(`500 - ${logMessage}`);
        }
        else {
            logging_handler_1.default.warn(logMessage);
        }
    }
    else {
        logging_handler_1.default.error(`500 - ${logMessage}`);
    }
};
const handleCustomError = (err, res) => {
    error_service_1.default.handle(err, res);
};
const handleNonCustomError = (err, req, res) => {
    logError(err, req);
    if (config_1.default.server.environment === 'development') {
        logging_handler_1.default.error(err.stack);
        res.status(500).json({ error: err.message });
    }
    else {
        handleCustomError(new error_service_1.InternalError(), res);
    }
};
const errorHandler = (err, req, res, next) => {
    if (err instanceof error_service_1.default) {
        handleCustomError(err, res);
        logError(err, req);
    }
    else {
        handleNonCustomError(err, req, res);
    }
    next(err);
};
exports.default = errorHandler;
