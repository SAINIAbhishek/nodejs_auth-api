"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTION_NAME = exports.DOCUMENT_NAME = exports.joiUserResetPasswordSchema = exports.joiUserLoginSchema = exports.joiUserUpdateSchema = exports.joiUserCreateSchema = exports.joiUserRegisterSchema = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const user_helper_1 = require("../helpers/user-helper");
const schema = new mongoose_1.Schema({
    firstname: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        maxlength: 200,
        required: true,
    },
    lastname: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        maxlength: 200,
        required: true,
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
        required: true,
        lowercase: true,
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        minlength: 8,
        maxlength: 255,
        select: false,
    },
    terms: {
        type: mongoose_1.Schema.Types.Boolean,
        select: false,
        default: true,
    },
    passwordUpdatedAt: {
        type: mongoose_1.Schema.Types.Date,
        select: false,
    },
    passwordResetToken: {
        type: mongoose_1.Schema.Types.String,
        select: false,
    },
    passwordResetTokenRaw: {
        type: mongoose_1.Schema.Types.String,
        select: false,
    },
    passwordResetTokenExpires: {
        type: mongoose_1.Schema.Types.Date,
        select: false,
    },
    roles: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Role',
            },
        ],
        required: true,
        select: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
schema.index({ email: 1 });
schema.index({ firstname: 1 });
schema.index({ firstname: 1, lastname: 1 });
schema.index({ createdAt: 1 });
schema.index({ updatedAt: 1 });
schema.virtual('name').get(function () {
    return (0, user_helper_1.fullName)(this.firstname, this.lastname);
});
schema.set('toJSON', {
    virtuals: true,
});
exports.joiUserRegisterSchema = joi_1.default.object({
    firstname: joi_1.default.string().max(200).required(),
    lastname: joi_1.default.string().max(200).required(),
    email: joi_1.default.string().min(5).max(255).email().required(),
    password: joi_1.default.string().min(8).max(255).required(),
    terms: joi_1.default.boolean().required(),
});
exports.joiUserCreateSchema = joi_1.default.object({
    firstname: joi_1.default.string().max(200).required(),
    lastname: joi_1.default.string().max(200).required(),
    email: joi_1.default.string().min(5).max(255).email().required(),
    password: joi_1.default.string().min(8).max(255).required(),
});
exports.joiUserUpdateSchema = joi_1.default.object({
    firstname: joi_1.default.string().max(200).optional(),
    lastname: joi_1.default.string().max(200).optional(),
    email: joi_1.default.string().min(5).max(255).email().optional(),
});
exports.joiUserLoginSchema = joi_1.default.object({
    email: joi_1.default.string().min(5).max(255).email().required(),
    password: joi_1.default.string().required(),
});
exports.joiUserResetPasswordSchema = joi_1.default.object({
    password: joi_1.default.string().min(8).max(255).required(),
    email: joi_1.default.string().min(5).max(255).email().required(),
});
exports.DOCUMENT_NAME = 'User';
exports.COLLECTION_NAME = 'users';
const UserModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
exports.default = UserModel;
