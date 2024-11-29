"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = __importDefault(require("../models/user-model"));
const error_service_1 = require("../services/error-service");
const role_model_1 = require("../models/role-model");
const role_type_1 = require("../types/role-type");
const auth_service_1 = __importDefault(require("../services/auth-service"));
const response_service_1 = require("../services/response-service");
const user_helper_1 = require("../helpers/user-helper");
const role_helper_1 = require("../helpers/role-helper");
class UserController {
    constructor() {
        this.createNewUser = (0, express_async_handler_1.default)(async (req, res) => {
            const { email, password, firstname, lastname } = req.body;
            const existingUser = await user_model_1.default.findOne({ email: email });
            if (existingUser) {
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
                roles: [role._id],
            };
            const newUser = await user_model_1.default.create(userObj);
            new response_service_1.SuccessResponse('User created successfully', {
                user: (0, user_helper_1.sanitizedUser)(newUser, [role]),
            }).send(res);
        });
        this.getAllUsers = (0, express_async_handler_1.default)(async (_, res) => {
            const users = await user_model_1.default.find().populate(role_helper_1.defaultRolePopulate).lean().exec();
            new response_service_1.SuccessResponse('Users fetched successfully', {
                total: users.length,
                user: users.map((user) => (0, user_helper_1.sanitizedUser)(user)),
            }).send(res);
        });
        this.getUser = (0, express_async_handler_1.default)(async (req, res) => {
            const { id } = req.params;
            const user = await user_model_1.default.findById(id).populate(role_helper_1.defaultRolePopulate).lean().exec();
            if (!user) {
                throw new error_service_1.NotFoundError('User not found');
            }
            new response_service_1.SuccessResponse('User fetched successfully', {
                user: (0, user_helper_1.sanitizedUser)(user),
            }).send(res);
        });
        this.updateUser = (0, express_async_handler_1.default)(async (req, res) => {
            const { email, firstname, lastname } = req.body;
            const updateFields = { email, firstname, lastname };
            Object.keys(updateFields).forEach((key) => updateFields[key] === undefined &&
                delete updateFields[key]);
            const { id } = req.params;
            const updatedUser = await user_model_1.default.findByIdAndUpdate(id, updateFields, { new: true })
                .populate(role_helper_1.defaultRolePopulate)
                .lean()
                .exec();
            if (!updatedUser) {
                throw new error_service_1.NotFoundError('User not found');
            }
            new response_service_1.SuccessResponse('User updated successfully', {
                user: (0, user_helper_1.sanitizedUser)(updatedUser),
            }).send(res);
        });
        this.deleteUser = (0, express_async_handler_1.default)(async (req, res) => {
            const { id } = req.params;
            const result = await user_model_1.default.deleteOne({ _id: id }).lean().exec();
            if (!result.deletedCount) {
                throw new error_service_1.NotFoundError('User not found');
            }
            new response_service_1.SuccessResponse('User deleted successfully', {
                userId: id,
            }).send(res);
        });
    }
}
exports.default = new UserController();
