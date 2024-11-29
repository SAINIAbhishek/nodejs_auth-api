"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailPreparePasswordUpdate = exports.emailPrepareReset = void 0;
const config_1 = __importDefault(require("../config"));
const emailFormatter = (content, firstname) => `
    Dear ${firstname}, <br><br>
    ${content} <br><br>
    Thank you for using our service! <br><br>
    Best regards, <br>
    Node.js Auth API
`;
const emailResetUrl = (email, passwordResetTokenRaw) => {
    return `${config_1.default.frontend.resetUrl}auth/reset-password/${passwordResetTokenRaw}?email=${email}`;
};
const emailResetMessage = (resetUrl) => {
    return `
        We've received a request to reset your password. Don't worry, we've got you covered! <br><br>
        To reset your password, simply click on the button below: <br><br>
        <a href="${resetUrl}" target="_blank">
          <button style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Reset Password
          </button>
        </a> <br><br>
        If you're having trouble with the button, you can also copy and paste this link into your browser's address bar: <br><br>
        ${resetUrl} <br><br>
        This password reset link will expire in 1 hour, so please reset your password promptly. <br><br>
        If you didn't initiate this request or have any concerns, please ignore this message. Your account remains secure.`;
};
const emailPrepareReset = (email, firstname, passwordResetTokenRaw) => {
    const resetUrl = emailResetUrl(email, passwordResetTokenRaw);
    const message = emailResetMessage(resetUrl);
    const content = emailFormatter(message, firstname);
    return {
        to: email,
        subject: 'Password change request received',
        content: content,
        url: resetUrl,
    };
};
exports.emailPrepareReset = emailPrepareReset;
const emailPreparePasswordUpdate = (email, firstname) => {
    const message = 'Your password has been successfully updated. If you did not initiate this change, please contact your administrator for assistance.';
    return {
        to: email,
        subject: 'Password update successfully',
        content: emailFormatter(message, firstname),
    };
};
exports.emailPreparePasswordUpdate = emailPreparePasswordUpdate;
