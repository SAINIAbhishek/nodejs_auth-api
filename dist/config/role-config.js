"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ROLES = void 0;
const mongoose_1 = require("mongoose");
const role_type_1 = require("../types/role-type");
exports.DEFAULT_ROLES = [
    {
        _id: new mongoose_1.Types.ObjectId('651ec99a91414a6b5efb1680'),
        name: role_type_1.RoleNameEnum.USER,
        status: role_type_1.RoleStatusEnum.ACTIVE,
        permissions: [role_type_1.RolePermissionEnum.VIEW],
    },
    {
        _id: new mongoose_1.Types.ObjectId('651ec99a91414a6b5efb1681'),
        name: role_type_1.RoleNameEnum.MANAGER,
        status: role_type_1.RoleStatusEnum.ACTIVE,
        permissions: [
            role_type_1.RolePermissionEnum.VIEW,
            role_type_1.RolePermissionEnum.EDIT,
            role_type_1.RolePermissionEnum.SHARE,
            role_type_1.RolePermissionEnum.UPDATE,
        ],
    },
    {
        _id: new mongoose_1.Types.ObjectId('651ec99a91414a6b5efb1682'),
        name: role_type_1.RoleNameEnum.ADMIN,
        status: role_type_1.RoleStatusEnum.ACTIVE,
        permissions: Object.values(role_type_1.RolePermissionEnum),
    },
];
