import { model, Schema, Types } from 'mongoose';
import Joi from 'joi';
import UserHelper from '../helpers/UserHelper';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
  _id: Types.ObjectId;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
      sparse: true, // allows null
      trim: true,
      minlength: 5,
      maxlength: 50,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      minlength: 8,
      maxlength: 255,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });

// a virtual property for name
UserSchema.virtual('name').get(function () {
  return UserHelper.fullName(this.firstname, this.lastname);
});

// ensuring the virtual property is included when converting the document to JSON
UserSchema.set('toJSON', {
  virtuals: true,
});

export const USER_JOI_REGISTER_SCHEMA: Joi.ObjectSchema = Joi.object({
  firstname: Joi.string().max(200).required(),
  lastname: Joi.string().max(200).required(),
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().min(8).max(255).required(),
});

export const USER_JOI_LOGIN_SCHEMA: Joi.ObjectSchema = Joi.object({
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().required(),
});

export const UserModel = model<User>(
  DOCUMENT_NAME,
  UserSchema,
  COLLECTION_NAME
);
