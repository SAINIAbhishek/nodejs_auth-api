import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

// Define the role name enum
export enum RoleNameEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

// Define the role status enum
export enum RoleStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Define the role permissions enum
export enum RolePermissionEnum {
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  UPDATE = 'UPDATE',
}

export default interface Role {
  _id?: Types.ObjectId;
  name?: RoleNameEnum;
  description?: string;
  status?: RoleStatusEnum;
  permissions?: RolePermissionEnum[];
  createdAt?: string;
  updatedAt?: string;
}

const RoleSchema = new Schema<Role>(
  {
    name: {
      type: Schema.Types.String,
      enum: Object.values(RoleNameEnum),
      default: RoleNameEnum.USER,
    },
    description: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 255,
      select: false,
    },
    status: {
      type: Schema.Types.String,
      enum: Object.values(RoleStatusEnum),
      default: RoleStatusEnum.ACTIVE,
      select: false,
    },
    permissions: {
      type: [Schema.Types.String],
      enum: Object.values(RolePermissionEnum),
      default: [RolePermissionEnum.VIEW],
    },
    createdAt: {
      type: Schema.Types.Date,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

RoleSchema.index({ name: 1 });
RoleSchema.index({ status: 1 });
RoleSchema.index({ createdAt: 1 });
RoleSchema.index({ updatedAt: 1 });

export const RoleModel = model<Role>(
  DOCUMENT_NAME,
  RoleSchema,
  COLLECTION_NAME
);
