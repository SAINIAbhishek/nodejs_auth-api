import {
  RoleModel,
  RoleNameEnum,
  RolePermissionEnum,
} from '../models/RoleModel';
import Logger from '../middleware/Logger';

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
          return { name: name, permissions: rolePermissions(name) };
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

function rolePermissions(role: RoleNameEnum) {
  if (role === RoleNameEnum.ADMIN) {
    return Object.values(RolePermissionEnum);
  }
  if (role === RoleNameEnum.MANAGER) {
    return [
      RolePermissionEnum.VIEW,
      RolePermissionEnum.EDIT,
      RolePermissionEnum.SHARE,
      RolePermissionEnum.UPDATE,
    ];
  }
  return [RolePermissionEnum.VIEW];
}
