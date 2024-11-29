"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth-routes"));
const user_routes_1 = __importDefault(require("./user-routes"));
const health_routes_1 = __importDefault(require("./health-routes"));
const router = express_1.default.Router();
router.use('/healthcheck', health_routes_1.default);
router.use('/oauth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
exports.default = router;
