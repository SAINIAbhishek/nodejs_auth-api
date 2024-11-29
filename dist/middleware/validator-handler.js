"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joiIdSchema = exports.joiTokenSchema = exports.joiEmailSchema = exports.joiAuthorizationSchema = exports.ValidationSource = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const error_service_1 = require("../services/error-service");
const logging_handler_1 = __importDefault(require("./logging-handler"));
const regex_config_1 = __importDefault(require("../config/regex-config"));
var ValidationSource;
(function (ValidationSource) {
    ValidationSource["BODY"] = "body";
    ValidationSource["HEADER"] = "headers";
    ValidationSource["QUERY"] = "query";
    ValidationSource["PARAM"] = "params";
})(ValidationSource = exports.ValidationSource || (exports.ValidationSource = {}));
const joiObjectId = () => joi_1.default.string().custom((value, helpers) => {
    if (!mongoose_1.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'Object Id Validation');
const joiAuthBearer = () => joi_1.default.string().custom((value, helpers) => {
    if (!value?.startsWith('Bearer ') || !value?.split(' ')[1]) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'Authorization Header Validation');
exports.joiAuthorizationSchema = joi_1.default.object({
    authorization: joiAuthBearer().required(),
}).unknown(true);
exports.joiEmailSchema = joi_1.default.object({
    email: joi_1.default.string().min(5).max(255).email().required(),
});
exports.joiTokenSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
});
exports.joiIdSchema = joi_1.default.object({
    id: joiObjectId().required(),
});
const validatorHandler = (schema, source = ValidationSource.BODY) => (req, _res, next) => {
    try {
        const { error } = schema.validate(req[source]);
        if (!error) {
            return next();
        }
        const message = error.details
            .map((detail) => detail.message.replace(regex_config_1.default.removeQuotes, ''))
            .join(', ');
        logging_handler_1.default.error(`Validation error: ${message}`);
        next(new error_service_1.BadRequestError(message));
    }
    catch (error) {
        next(error);
    }
};
exports.default = validatorHandler;
