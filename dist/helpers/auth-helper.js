"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokens = exports.validateTokenData = exports.getAccessToken = exports.generateHashTokenKey = exports.generateTokenKey = exports.validatePasswordUpdate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
const error_service_1 = require("../services/error-service");
const config_1 = __importDefault(require("../config"));
const user_helper_1 = require("./user-helper");
const validatePasswordUpdate = (payload, user) => {
    if (user?.passwordUpdatedAt) {
        const tokenIatTimestamp = payload.iat ?? 0;
        const pwdTimestamp = new Date(user.passwordUpdatedAt).getTime() / 1000;
        if (pwdTimestamp > tokenIatTimestamp) {
            throw new error_service_1.AuthFailureError('Password has been updated recently, please login again.');
        }
    }
};
exports.validatePasswordUpdate = validatePasswordUpdate;
const generateTokenKey = () => {
    return crypto_1.default.randomBytes(64).toString('hex');
};
exports.generateTokenKey = generateTokenKey;
const generateHashTokenKey = (key) => {
    return crypto_1.default.createHash('sha256').update(key).digest('hex');
};
exports.generateHashTokenKey = generateHashTokenKey;
const getAccessToken = (authorization) => {
    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new error_service_1.AuthFailureError('Unauthorized');
    }
    return authorization.split(' ')[1];
};
exports.getAccessToken = getAccessToken;
const validateTokenData = (payload, message = 'Invalid Token') => {
    const { iss, sub, aud, iat, exp } = payload;
    if (!iss ||
        !sub ||
        !aud ||
        !iat ||
        !exp ||
        iss !== config_1.default.token.issuer ||
        aud !== config_1.default.token.audience ||
        !mongoose_1.Types.ObjectId.isValid(sub)) {
        throw new error_service_1.AuthFailureError(message);
    }
    return true;
};
exports.validateTokenData = validateTokenData;
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expiresIn,
    });
    if (!token) {
        throw new error_service_1.InternalError();
    }
    return token;
};
const createTokens = (user) => {
    const payload = {
        sub: user._id?.toString() || '',
        name: (0, user_helper_1.fullName)(user.firstname, user.lastname),
        iss: config_1.default.token.issuer,
        iat: Math.floor(Date.now() / 1000),
        aud: config_1.default.token.audience,
    };
    const accessToken = generateToken(payload, config_1.default.token.accessTokenSecret, config_1.default.token.accessTokenValidity);
    const refreshToken = generateToken(payload, config_1.default.token.refreshTokenSecret, config_1.default.token.refreshTokenValidity);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createTokens = createTokens;
