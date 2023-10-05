import { RoleNameEnum, RolePermissionEnum } from '../models/RoleModel';

const RolePermissions = (role: RoleNameEnum) => {
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
};

export default RolePermissions;
