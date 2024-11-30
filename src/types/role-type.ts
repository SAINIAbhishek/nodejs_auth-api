import { Types } from 'mongoose';

export enum RoleNameEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export enum RoleStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum RolePermissionEnum {
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  UPDATE = 'UPDATE',
}

export type Role = {
  _id: Types.ObjectId;
  name: RoleNameEnum;
  description?: string;
  status?: RoleStatusEnum;
  permissions: RolePermissionEnum[];
  createdAt?: string;
  updatedAt?: string;
};
