"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const logging_handler_1 = __importDefault(require("../middleware/logging-handler"));
const response_service_1 = require("../services/response-service");
const auth_helper_1 = require("../helpers/auth-helper");
const config_1 = __importDefault(require("../config"));
const user_model_1 = __importDefault(require("../models/user-model"));
const role_helper_1 = require("../helpers/role-helper");
const error_service_1 = require("../services/error-service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_helper_1 = require("../helpers/user-helper");
const role_model_1 = require("../models/role-model");
const role_type_1 = require("../types/role-type");
const auth_service_1 = __importDefault(require("../services/auth-service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    constructor() {
        this.forgotPassword = (0, express_async_handler_1.default)(async (req, res, next) => {
            const { email } = req.body;
            const user = await user_model_1.default.findOne({ email: email });
            if (!user) {
                logging_handler_1.default.info(`Attempted password reset for non-existent email: ${email}`);
                new response_service_1.SuccessMsgResponse('If the email exists, you will receive an email to reset the password.').send(res);
            }
            else {
                const resetToken = (0, auth_helper_1.generateTokenKey)();
                user.passwordResetTokenRaw = resetToken;
                user.passwordResetToken = (0, auth_helper_1.generateHashTokenKey)(resetToken);
                user.passwordResetTokenExpires = new Date(Date.now() + config_1.default.token.passwordResetTokenValidity).toString();
                await user.save({ validateBeforeSave: false });
                req.user = {
                    id: user._id.toString() ?? '',
                    email: email,
                    firstname: user.firstname ?? '',
                    passwordResetTokenRaw: user.passwordResetTokenRaw,
                };
            }
            next();
        });
        this.resetPassword = (0, express_async_handler_1.default)(async (req, _res, next) => {
            const { password, email } = req.body;
            const { token } = req.params;
            let filter = {
                passwordResetTokenRaw: token,
                passwordResetToken: token,
                email: email,
                passwordResetTokenExpires: { $gt: Date.now() },
            };
            if (!token) {
                logging_handler_1.default.info(`Attempted password reset, ${JSON.stringify(filter)}`);
                throw new error_service_1.BadRequestError('Token is invalid or has been expired.');
            }
            filter = {
                ...filter,
                passwordResetToken: (0, auth_helper_1.generateHashTokenKey)(token),
            };
            const user = await user_model_1.default.findOne(filter);
            if (!user) {
                logging_handler_1.default.info(`Attempted password reset, ${JSON.stringify(filter)}`);
                throw new error_service_1.BadRequestError('Token is invalid or has been expired.');
            }
            user.passwordResetToken = undefined;
            user.passwordResetTokenRaw = undefined;
            user.passwordResetTokenExpires = undefined;
            user.passwordUpdatedAt = Date.now().toString();
            user.password = await auth_service_1.default.generateHashPassword(password);
            await user.save();
            req.user = {
                id: user._id.toString() ?? '',
                email: email,
                firstname: user.firstname ?? '',
            };
            req.resetPassword = {
                isPasswordUpdated: true,
            };
            next();
        });
        this.isAuthorized = (0, express_async_handler_1.default)(async (req, _res, next) => {
            const { authorization } = req.headers;
            const token = (0, auth_helper_1.getAccessToken)(authorization);
            if (!token) {
                throw new error_service_1.AuthFailureError('Authorization token is missing');
            }
            const accessTokenPayload = jsonwebtoken_1.default.verify(token, config_1.default.token.accessTokenSecret);
            (0, auth_helper_1.validateTokenData)(accessTokenPayload, 'Unauthorized');
            const userId = accessTokenPayload.sub ?? '';
            const user = await user_model_1.default.findById(userId).select('+passwordUpdatedAt').lean().exec();
            if (!user) {
                throw new error_service_1.AuthFailureError('User not found');
            }
            (0, auth_helper_1.validatePasswordUpdate)(accessTokenPayload, user);
            req.session = {
                ...req.session,
                accessToken: token,
                userId: userId,
            };
            next();
        });
        this.register = (0, express_async_handler_1.default)(async (req, res) => {
            const { email, password, firstname, lastname } = req.body;
            const existingUser = await user_model_1.default.findOne({ email: email }).lean().exec();
            if (existingUser) {
                logging_handler_1.default.info(`Attempted user register for already registered, ${email}`);
                throw new error_service_1.BadRequestError('User already registered');
            }
            const role = await role_model_1.RoleModel.findOne({ name: role_type_1.RoleNameEnum.USER }).lean().exec();
            if (!role) {
                throw new error_service_1.InternalError('Role must be defined');
            }
            const hashedPassword = await auth_service_1.default.generateHashPassword(password);
            const userObj = {
                email,
                password: hashedPassword,
                firstname,
                lastname,
                roles: [role],
            };
            await user_model_1.default.create(userObj);
            new response_service_1.SuccessMsgResponse('The user has been registered successfully').send(res);
        });
        this.login = (0, express_async_handler_1.default)(async (req, res) => {
            const email = req.body.email;
            const user = await user_model_1.default.findOne({ email: email })
                .select('+password')
                .populate(role_helper_1.defaultRolePopulate)
                .lean()
                .exec();
            if (!user?.password) {
                throw new error_service_1.BadRequestError('Your email address or password is incorrect');
            }
            const isMatched = await bcrypt_1.default.compare(req.body.password, user.password);
            if (!isMatched) {
                throw new error_service_1.AuthFailureError('Your credentials are incorrect');
            }
            const tokens = (0, auth_helper_1.createTokens)(user);
            res.cookie(config_1.default.cookie.login, tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: true,
                maxAge: config_1.default.cookie.maxAge,
            });
            new response_service_1.SuccessResponse('User logged in successfully', {
                tokens,
                user: (0, user_helper_1.sanitizedUser)(user),
            }).send(res);
        });
        this.refreshToken = (0, express_async_handler_1.default)(async (req, res) => {
            const refreshToken = (req.cookies && req.cookies[config_1.default.cookie.login]) ?? null;
            if (!refreshToken) {
                throw new error_service_1.AuthFailureError('Refresh token is missing');
            }
            const refreshTokenPayload = jsonwebtoken_1.default.verify(refreshToken, config_1.default.token.refreshTokenSecret);
            (0, auth_helper_1.validateTokenData)(refreshTokenPayload);
            const userId = refreshTokenPayload.sub ?? '';
            const user = await user_model_1.default.findById(userId)
                .select('+passwordUpdatedAt')
                .populate(role_helper_1.defaultRolePopulate)
                .lean()
                .exec();
            if (!user) {
                throw new error_service_1.AuthFailureError('User not found');
            }
            (0, auth_helper_1.validatePasswordUpdate)(refreshTokenPayload, user);
            const tokens = (0, auth_helper_1.createTokens)(user);
            new response_service_1.TokenRefreshResponse('Token issued', {
                tokens: {
                    accessToken: tokens.accessToken,
                },
                user: (0, user_helper_1.sanitizedUser)(user),
            }).send(res);
        });
        this.logout = (0, express_async_handler_1.default)(async (req, res) => {
            const refreshToken = (req.cookies && req.cookies[config_1.default.cookie.login]) ?? null;
            if (refreshToken) {
                res.clearCookie(config_1.default.cookie.login, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
            }
            new response_service_1.SuccessMsgResponse('User logged out successfully').send(res);
        });
    }
}
exports.default = new AuthController();
