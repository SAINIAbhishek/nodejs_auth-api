"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionEnum = exports.RoleStatusEnum = exports.RoleNameEnum = void 0;
var RoleNameEnum;
(function (RoleNameEnum) {
    RoleNameEnum["USER"] = "USER";
    RoleNameEnum["ADMIN"] = "ADMIN";
    RoleNameEnum["MANAGER"] = "MANAGER";
})(RoleNameEnum = exports.RoleNameEnum || (exports.RoleNameEnum = {}));
var RoleStatusEnum;
(function (RoleStatusEnum) {
    RoleStatusEnum["ACTIVE"] = "ACTIVE";
    RoleStatusEnum["INACTIVE"] = "INACTIVE";
})(RoleStatusEnum = exports.RoleStatusEnum || (exports.RoleStatusEnum = {}));
var RolePermissionEnum;
(function (RolePermissionEnum) {
    RolePermissionEnum["EDIT"] = "EDIT";
    RolePermissionEnum["VIEW"] = "VIEW";
    RolePermissionEnum["DELETE"] = "DELETE";
    RolePermissionEnum["SHARE"] = "SHARE";
    RolePermissionEnum["UPDATE"] = "UPDATE";
})(RolePermissionEnum = exports.RolePermissionEnum || (exports.RolePermissionEnum = {}));
