"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_model_1 = require("../models/role-model");
const logging_handler_1 = __importDefault(require("../middleware/logging-handler"));
const role_config_1 = require("../config/role-config");
const role_type_1 = require("../types/role-type");
const roles = [role_type_1.RoleNameEnum.USER, role_type_1.RoleNameEnum.ADMIN, role_type_1.RoleNameEnum.MANAGER];
const initializeRoles = async () => {
    try {
        const existingRoles = await role_model_1.RoleModel.find({ name: { $in: roles } });
        const existingRoleNames = new Set(existingRoles.map((role) => role.name));
        const rolesToAdd = roles.filter((role) => !existingRoleNames.has(role));
        if (rolesToAdd.length > 0) {
            const rolesToInsert = rolesToAdd
                .map((name) => {
                const role = role_config_1.DEFAULT_ROLES.find((value) => value.name === name);
                if (!role) {
                    logging_handler_1.default.warn(`Role definition for ${name} not found in DEFAULT_ROLES`);
                    return null;
                }
                return {
                    name: role.name,
                    permissions: role.permissions,
                    _id: role._id,
                };
            })
                .filter(Boolean);
            if (rolesToInsert.length > 0) {
                await role_model_1.RoleModel.insertMany(rolesToInsert);
                logging_handler_1.default.info('Roles have been initialized in the database.');
            }
        }
        else {
            logging_handler_1.default.info('Roles already exist in the database!');
        }
    }
    catch (error) {
        logging_handler_1.default.info('Error while initializing roles in the database.');
        logging_handler_1.default.error(error);
    }
};
exports.default = initializeRoles;
