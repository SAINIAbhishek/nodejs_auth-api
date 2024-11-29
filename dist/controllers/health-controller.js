"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const response_service_1 = require("../services/response-service");
class HealthController {
    constructor() {
        this.checkServerHealth = (0, express_async_handler_1.default)(async (_req, res) => {
            new response_service_1.SuccessMsgResponse('The API is up and running. Health check is passed.').send(res);
        });
    }
}
exports.default = new HealthController();
