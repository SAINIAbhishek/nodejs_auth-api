"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
const email_type_1 = require("../types/email-type");
const schema = new mongoose_1.Schema({
    subject: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        required: true,
    },
    error: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        select: false,
    },
    status: {
        type: mongoose_1.Schema.Types.String,
        enum: email_type_1.EmailStatusEnum,
        default: email_type_1.EmailStatusEnum.QUEUED,
    },
    url: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
    },
    content: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        required: true,
    },
    to: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        minlength: 5,
        maxlength: 50,
        required: true,
        lowercase: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
schema.index({ to: 1 });
schema.index({ status: 1 });
schema.index({ createdAt: 1 });
schema.index({ updatedAt: 1 });
exports.DOCUMENT_NAME = 'Email';
exports.COLLECTION_NAME = 'emails';
exports.EmailModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
