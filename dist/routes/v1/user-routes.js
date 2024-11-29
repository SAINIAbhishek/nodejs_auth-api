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
const express_1 = __importDefault(require("express"));
const validator_handler_1 = __importStar(require("../../middleware/validator-handler"));
const auth_controller_1 = __importDefault(require("../../controllers/auth-controller"));
const user_model_1 = require("../../models/user-model");
const user_controller_1 = __importDefault(require("../../controllers/user-controller"));
const router = express_1.default.Router();
router.use((0, validator_handler_1.default)(validator_handler_1.joiAuthorizationSchema, validator_handler_1.ValidationSource.HEADER), auth_controller_1.default.isAuthorized);
router
    .route('/')
    .post((0, validator_handler_1.default)(user_model_1.joiUserCreateSchema, validator_handler_1.ValidationSource.BODY), user_controller_1.default.createNewUser)
    .get(user_controller_1.default.getAllUsers);
router.use('/:id', (0, validator_handler_1.default)(validator_handler_1.joiIdSchema, validator_handler_1.ValidationSource.PARAM));
router
    .route('/:id')
    .get(user_controller_1.default.getUser)
    .put((0, validator_handler_1.default)(user_model_1.joiUserUpdateSchema, validator_handler_1.ValidationSource.BODY), user_controller_1.default.updateUser)
    .delete(user_controller_1.default.deleteUser);
exports.default = router;
