import { Role } from '../types/role-type';
import { User } from '../types/user-type';
import { sanitizedRoles } from './role-helper';

/**
 * Generates the full name of a user by combining their first and last name.
 * @param firstname - The first name of the user (optional).
 * @param lastname - The last name of the user (optional).
 * @returns The full name of the user as a string.
 */
export const fullName = (firstname?: string, lastname?: string): string => {
  return `${firstname || ''}${lastname ? ' ' + lastname : ''}`;
};

/**
 * Sanitizes a user object by selecting specific fields and formatting roles.
 * Ensures sensitive or unnecessary fields are excluded and roles are processed using `sanitizedRoles`.
 * @param user - The user object to be sanitized.
 * @param roles - An optional array of roles to replace the user's existing roles. Defaults to an empty array.
 * @returns A sanitized user object containing selected fields and formatted roles.
 */
export const sanitizedUser = (user: User, roles: Role[] = []): User => {
  return {
    _id: user._id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    name: fullName(user.firstname, user.lastname),
    roles: roles.length ? sanitizedRoles(roles) : (user.roles ?? []),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
