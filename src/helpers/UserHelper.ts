import User, { UserModel } from '../models/UserModel';
import { Types } from 'mongoose';

const fullName = (firstname?: string, lastname?: string) => {
  return `${firstname || ''}${lastname ? ' ' + lastname : ''}`;
};

const findById = async (id: Types.ObjectId): Promise<User | null> => {
  return UserModel.findOne({ _id: id }).select('-password').exec();
};

const findByEmail = async (email: string): Promise<User | null> => {
  return UserModel.findOne({ email: email }).exec();
};

export default { findByEmail, fullName, findById };
