"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const email_model_1 = require("../models/email-model");
const error_service_1 = require("../services/error-service");
const email_type_1 = require("../types/email-type");
const email_helper_1 = require("../helpers/email-helper");
const email_service_1 = __importDefault(require("../services/email-service"));
const logging_handler_1 = __importDefault(require("../middleware/logging-handler"));
const user_model_1 = __importDefault(require("../models/user-model"));
const response_service_1 = require("../services/response-service");
class EmailController {
    constructor() {
        this.passwordUpdateSuccessfully = (0, express_async_handler_1.default)(async (req, res) => {
            const user = req.user;
            const isPasswordUpdated = req.resetPassword.isPasswordUpdated;
            if (!isPasswordUpdated || !user?.id) {
                throw new error_service_1.BadRequestError('There was an error while resetting password. Please try again later.');
            }
            const email = (0, email_helper_1.emailPreparePasswordUpdate)(user.email, user.firstname);
            try {
                await email_service_1.default.sendEmail({
                    to: email.to,
                    subject: email.subject,
                    html: email.content,
                });
                email.status = email_type_1.EmailStatusEnum.SENT;
            }
            catch (err) {
                email.status = email_type_1.EmailStatusEnum.ERROR;
                email.error =
                    err instanceof Error
                        ? err.message
                        : 'Nodemailer error while sending the password update mail.';
                logging_handler_1.default.error(err);
            }
            await email_model_1.EmailModel.create(email);
            new response_service_1.SuccessMsgResponse('The password has been updated successfully').send(res);
        });
        this.resetPassword = (0, express_async_handler_1.default)(async (req, res) => {
            const user = req.user;
            if (!user) {
                throw new error_service_1.BadRequestError('There was an error while resetting password. Please try again later.');
            }
            const passwordResetTokenRaw = user.passwordResetTokenRaw;
            if (!passwordResetTokenRaw) {
                throw new error_service_1.BadRequestError('There was an error while resetting password. Please try again later.');
            }
            const email = (0, email_helper_1.emailPrepareReset)(user.email, user.firstname, passwordResetTokenRaw);
            try {
                await email_service_1.default.sendEmail({
                    to: email.to,
                    subject: email.subject,
                    html: email.content,
                });
                email.status = email_type_1.EmailStatusEnum.SENT;
            }
            catch (err) {
                email.status = email_type_1.EmailStatusEnum.ERROR;
                email.error =
                    err instanceof Error
                        ? err.message
                        : 'Nodemailer error while sending the password reset mail.';
                logging_handler_1.default.error(err);
                const updateFields = {
                    passwordResetToken: undefined,
                    passwordResetTokenRaw: undefined,
                    passwordResetTokenExpires: undefined,
                };
                await user_model_1.default.findOneAndUpdate({ _id: user.id }, { $set: updateFields }).lean().exec();
            }
            await email_model_1.EmailModel.create(email);
            if (email.status === email_type_1.EmailStatusEnum.ERROR) {
                throw new error_service_1.InternalError('There was an error while sending the reset password email. Please try again later.');
            }
            new response_service_1.SuccessResponse('The password reset email has been sent successfully', {
                passwordResetToken: user.passwordResetTokenRaw,
            }).send(res);
        });
    }
}
exports.default = new EmailController();
