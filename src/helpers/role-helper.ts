import { RoleStatusEnum, Role } from '../types/role-type';

/**
 * Default role population configuration for database queries.
 */
export const defaultRolePopulate = [
  {
    path: 'roles',
    match: { status: RoleStatusEnum.ACTIVE },
    select: '-createdAt -updatedAt',
  },
];

/**
 * Sanitizes a list of roles by selecting specific fields.
 * Ensures sensitive or unnecessary fields are excluded from the returned roles.
 * @param roles - An array of roles to be sanitized. Defaults to an empty array if none are provided.
 * @returns An array of sanitized roles, each containing only the `_id`, `name`, and `permissions` fields.
 */
export const sanitizedRoles = (roles: Role[] = []): Role[] => {
  return roles.map((role) => {
    return {
      _id: role._id,
      name: role.name,
      permissions: role.permissions,
    };
  });
};
