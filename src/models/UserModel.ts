import { model, Schema, Types } from 'mongoose';
import Joi from 'joi';
import UserHelper from '../helpers/UserHelper';
import Role from './RoleModel';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
  _id?: Types.ObjectId;
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  passwordUpdatedAt?: string;
  passwordResetToken?: string; // hashed token
  passwordResetTokenRaw?: string; // plain token
  passwordResetTokenExpires?: string;
  roles?: Role[];
}

const UserSchema = new Schema<User>(
  {
    firstname: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
      required: true,
    },
    lastname: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      trim: true,
      minlength: 5,
      maxlength: 50,
      required: true,
      lowercase: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      minlength: 8,
      maxlength: 255,
      select: false,
    },
    passwordUpdatedAt: {
      type: Schema.Types.Date,
      select: false,
    },
    passwordResetToken: {
      type: Schema.Types.String,
      select: false,
    },
    passwordResetTokenRaw: {
      type: Schema.Types.String,
      select: false,
    },
    passwordResetTokenExpires: {
      type: Schema.Types.Date,
      select: false,
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ firstname: 1 });
UserSchema.index({ firstname: 1, lastname: 1 });
UserSchema.index({ createdAt: 1 });
UserSchema.index({ updatedAt: 1 });

// a virtual property for name
UserSchema.virtual('name').get(function () {
  return UserHelper.fullName(this.firstname, this.lastname);
});

// ensuring the virtual property is included when converting the document to JSON
UserSchema.set('toJSON', {
  virtuals: true,
});

export const JOI_USER_REGISTER_SCHEMA: Joi.ObjectSchema = Joi.object({
  firstname: Joi.string().max(200).required(),
  lastname: Joi.string().max(200).required(),
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().min(8).max(255).required(),
});

export const JOI_USER_CREATE_SCHEMA: Joi.ObjectSchema = Joi.object({
  firstname: Joi.string().max(200).required(),
  lastname: Joi.string().max(200).required(),
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().min(8).max(255).required(),
});

export const JOI_USER_UPDATE_SCHEMA: Joi.ObjectSchema = Joi.object({
  firstname: Joi.string().max(200).optional(),
  lastname: Joi.string().max(200).optional(),
  email: Joi.string().min(5).max(255).email().optional(),
});

export const JOI_USER_LOGIN_SCHEMA: Joi.ObjectSchema = Joi.object({
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().required(),
});

export const JOI_USER_RESET_PASSWORD_SCHEMA: Joi.ObjectSchema = Joi.object({
  password: Joi.string().min(8).max(255).required(),
});

export const UserModel = model<User>(
  DOCUMENT_NAME,
  UserSchema,
  COLLECTION_NAME
);
