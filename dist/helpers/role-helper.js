"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizedRoles = exports.defaultRolePopulate = void 0;
const role_type_1 = require("../types/role-type");
exports.defaultRolePopulate = [
    {
        path: 'roles',
        match: { status: role_type_1.RoleStatusEnum.ACTIVE },
        select: '-createdAt -updatedAt',
    },
];
const sanitizedRoles = (roles = []) => {
    return roles.map((role) => {
        return {
            _id: role._id,
            name: role.name,
            permissions: role.permissions,
        };
    });
};
exports.sanitizedRoles = sanitizedRoles;
