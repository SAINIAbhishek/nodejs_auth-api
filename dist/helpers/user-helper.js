"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizedUser = exports.fullName = void 0;
const role_helper_1 = require("./role-helper");
const fullName = (firstname, lastname) => {
    return `${firstname || ''}${lastname ? ' ' + lastname : ''}`;
};
exports.fullName = fullName;
const sanitizedUser = (user, roles = []) => {
    return {
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        name: (0, exports.fullName)(user.firstname, user.lastname),
        roles: roles.length ? (0, role_helper_1.sanitizedRoles)(roles) : (user.roles ?? []),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.sanitizedUser = sanitizedUser;
