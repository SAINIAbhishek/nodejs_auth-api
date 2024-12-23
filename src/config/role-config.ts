import { Types } from 'mongoose';
import { Role, RoleNameEnum, RoleStatusEnum, RolePermissionEnum } from '../types/role-type';

export const DEFAULT_ROLES: Role[] = [
  {
    _id: new Types.ObjectId('651ec99a91414a6b5efb1680'),
    name: RoleNameEnum.USER,
    status: RoleStatusEnum.ACTIVE,
    permissions: [RolePermissionEnum.VIEW],
  },
  {
    _id: new Types.ObjectId('651ec99a91414a6b5efb1681'),
    name: RoleNameEnum.MANAGER,
    status: RoleStatusEnum.ACTIVE,
    permissions: [
      RolePermissionEnum.VIEW,
      RolePermissionEnum.EDIT,
      RolePermissionEnum.SHARE,
      RolePermissionEnum.UPDATE,
    ],
  },
  {
    _id: new Types.ObjectId('651ec99a91414a6b5efb1682'),
    name: RoleNameEnum.ADMIN,
    status: RoleStatusEnum.ACTIVE,
    permissions: Object.values(RolePermissionEnum),
  },
];
