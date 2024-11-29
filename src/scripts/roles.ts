import { RoleModel, RoleNameEnum } from '../models/RoleModel';
import Logger from '../middleware/Logger';
import DEFAULT_ROLES from '../config/RolesConfig';

const roles = [RoleNameEnum.USER, RoleNameEnum.ADMIN, RoleNameEnum.MANAGER];

export default async function initializeRoles() {
  try {
    const existingRoles = await RoleModel.find({
      name: { $in: roles },
    });

    const rolesToAdd = roles.filter((role) => {
      return !existingRoles.some((existingRole) => {
        return existingRole.name === role;
      });
    });

    if (rolesToAdd.length > 0) {
      await RoleModel.insertMany(
        rolesToAdd.map((name) => {
          const role = DEFAULT_ROLES.find((_role) => _role.name === name);
          if (!role) return;

          return {
            name: role?.name,
            permissions: role?.permissions,
            _id: role?._id,
          };
        })
      );
      Logger.info('Roles have been initialized in the database');
    } else {
      Logger.info('Roles already exist in the database');
    }
  } catch (error: any) {
    Logger.info('Error while initializing roles in the database');
    Logger.error(error);
  }
}
