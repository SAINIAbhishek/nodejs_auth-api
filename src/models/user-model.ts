import { model, Schema } from 'mongoose';
import Joi from 'joi';
import { User } from '../types/user-type';
import { fullName } from '../helpers/user-helper';

const schema = new Schema<User>(
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
    terms: {
      type: Schema.Types.Boolean,
      select: false,
      default: true,
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
      select: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.index({ email: 1 });
schema.index({ firstname: 1 });
schema.index({ firstname: 1, lastname: 1 });
schema.index({ createdAt: 1 });
schema.index({ updatedAt: 1 });

// a virtual property for name
schema.virtual('name').get(function () {
  return fullName(this.firstname, this.lastname);
});

// ensuring the virtual property is included when converting the document to JSON
schema.set('toJSON', {
  virtuals: true,
});

export const joiUserRegisterSchema: Joi.ObjectSchema = Joi.object({
  firstname: Joi.string().max(200).required(),
  lastname: Joi.string().max(200).required(),
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().min(8).max(255).required(),
  terms: Joi.boolean().required(),
});

export const joiUserCreateSchema: Joi.ObjectSchema = Joi.object({
  firstname: Joi.string().max(200).required(),
  lastname: Joi.string().max(200).required(),
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().min(8).max(255).required(),
});

export const joiUserUpdateSchema: Joi.ObjectSchema = Joi.object({
  firstname: Joi.string().max(200).optional(),
  lastname: Joi.string().max(200).optional(),
  email: Joi.string().min(5).max(255).email().optional(),
});

export const joiUserLoginSchema: Joi.ObjectSchema = Joi.object({
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().required(),
});

export const joiUserResetPasswordSchema: Joi.ObjectSchema = Joi.object({
  password: Joi.string().min(8).max(255).required(),
  email: Joi.string().min(5).max(255).email().required(),
});

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
export default UserModel;
