import { DEFAULT_ROLES } from '../config/role-config';
import logger from '../middleware/logging-handler';
import { RoleModel } from '../models/role-model';
import { RoleNameEnum } from '../types/role-type';

/**
 * Predefined list of roles that need to be checked or initialized.
 */
const roles = [RoleNameEnum.USER, RoleNameEnum.ADMIN, RoleNameEnum.MANAGER];

/**
 * Function to initialize roles in the database.
 * It checks if the roles already exist in the database and inserts them if necessary.
 */
const initializeRoles = async () => {
  try {
    const existingRoles = await RoleModel.find({ name: { $in: roles } });
    const existingRoleNames = new Set(existingRoles.map((role) => role.name));
    const rolesToAdd = roles.filter((role) => !existingRoleNames.has(role));

    if (rolesToAdd.length > 0) {
      const rolesToInsert = rolesToAdd
        .map((name) => {
          const role = DEFAULT_ROLES.find((value) => value.name === name);

          if (!role) {
            logger.warn(`Role definition for ${name} not found in DEFAULT_ROLES`);
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
        await RoleModel.insertMany(rolesToInsert);
        logger.info('Roles have been initialized in the database.');
      }
    } else {
      logger.info('Roles already exist in the database!');
    }
  } catch (error) {
    logger.info('Error while initializing roles in the database.');
    logger.error(error);
  }
};

export default initializeRoles;
