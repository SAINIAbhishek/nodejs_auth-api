"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
const role_type_1 = require("../types/role-type");
const schema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.String,
        enum: Object.values(role_type_1.RoleNameEnum),
        default: role_type_1.RoleNameEnum.USER,
    },
    description: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        maxlength: 255,
        select: false,
    },
    status: {
        type: mongoose_1.Schema.Types.String,
        enum: Object.values(role_type_1.RoleStatusEnum),
        default: role_type_1.RoleStatusEnum.ACTIVE,
        select: false,
    },
    permissions: {
        type: [mongoose_1.Schema.Types.String],
        enum: Object.values(role_type_1.RolePermissionEnum),
        default: [role_type_1.RolePermissionEnum.VIEW],
    },
}, {
    versionKey: false,
    timestamps: true,
});
schema.index({ name: 1 });
exports.DOCUMENT_NAME = 'Role';
exports.COLLECTION_NAME = 'roles';
exports.RoleModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
