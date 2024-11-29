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
const auth_controller_1 = __importDefault(require("../../controllers/auth-controller"));
const validator_handler_1 = __importStar(require("../../middleware/validator-handler"));
const email_controller_1 = __importDefault(require("../../controllers/email-controller"));
const user_model_1 = require("../../models/user-model");
const rate_limiter_service_1 = __importDefault(require("../../services/rate-limiter-service"));
const router = express_1.default.Router();
router
    .route('/login')
    .post((0, validator_handler_1.default)(user_model_1.joiUserLoginSchema, validator_handler_1.ValidationSource.BODY), rate_limiter_service_1.default.loginLimiter, auth_controller_1.default.login);
router
    .route('/register')
    .post((0, validator_handler_1.default)(user_model_1.joiUserRegisterSchema, validator_handler_1.ValidationSource.BODY), auth_controller_1.default.register);
router
    .route('/forgotPassword')
    .post((0, validator_handler_1.default)(validator_handler_1.joiEmailSchema, validator_handler_1.ValidationSource.BODY), rate_limiter_service_1.default.forgotPasswordLimiter, auth_controller_1.default.forgotPassword, email_controller_1.default.resetPassword);
router
    .route('/resetPassword/:token')
    .patch((0, validator_handler_1.default)(validator_handler_1.joiTokenSchema, validator_handler_1.ValidationSource.PARAM), (0, validator_handler_1.default)(user_model_1.joiUserResetPasswordSchema, validator_handler_1.ValidationSource.BODY), auth_controller_1.default.resetPassword, email_controller_1.default.passwordUpdateSuccessfully);
router
    .route('/refresh')
    .post((0, validator_handler_1.default)(validator_handler_1.joiAuthorizationSchema, validator_handler_1.ValidationSource.HEADER), auth_controller_1.default.isAuthorized, auth_controller_1.default.refreshToken);
router.route('/logout').post(auth_controller_1.default.logout);
exports.default = router;
