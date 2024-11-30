import { Types } from 'mongoose';
import { Role } from './role-type';

export type User = {
  _id?: Types.ObjectId;
  firstname?: string;
  lastname?: string;
  name?: string; // virtual
  email?: string;
  password?: string;
  terms?: boolean;
  createdAt?: string;
  updatedAt?: string;
  passwordUpdatedAt?: string;
  passwordResetToken?: string; // hashed token
  passwordResetTokenRaw?: string; // plain token
  passwordResetTokenExpires?: string;
  roles?: Role[];
};

export type UserUpdate = {
  email: string;
  firstname: string;
  lastname: string;
};
