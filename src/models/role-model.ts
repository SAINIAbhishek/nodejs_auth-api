import { model, Schema } from 'mongoose';
import { Role, RoleNameEnum, RoleStatusEnum, RolePermissionEnum } from '../types/role-type';

const schema = new Schema<Role>(
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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.index({ name: 1 });

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
