"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
class EmailService {
    constructor() {
        this.sendEmail = async (options) => {
            const { mailtrap, server } = config_1.default;
            const isProdEnv = server.emailEnv === 'production';
            const emailConfig = isProdEnv ? mailtrap.prod : mailtrap.testing;
            const transporter = nodemailer_1.default.createTransport({
                host: emailConfig.host,
                port: emailConfig.port,
                auth: {
                    user: emailConfig.username,
                    pass: emailConfig.password,
                },
            });
            const defaultOptions = {
                from: 'Node.Js Auth Api<support@sai.com>',
                ...options,
            };
            return await transporter.sendMail(defaultOptions);
        };
    }
}
exports.default = new EmailService();
