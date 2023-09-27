import User, { UserModel } from '../models/UserModel';
import { Types } from 'mongoose';

const fullName = (firstname?: string, lastname?: string) => {
  return `${firstname || ''}${lastname ? ' ' + lastname : ''}`;
};

const sanitizedUser = (user: User): User => {
  return {
    _id: user._id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    name: fullName(user.firstname, user.lastname),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const findById = async (
  id: string,
  selectFields = ''
): Promise<User | null> => {
  return UserModel.findOne({ _id: new Types.ObjectId(id) })
    .select(selectFields)
    .exec();
};

const findByEmail = async (
  email: string,
  selectFields = ''
): Promise<User | null> => {
  return UserModel.findOne({ email: email }).select(selectFields).exec();
};

const findAll = async (
  filter: object = {},
  selectFields = ''
): Promise<User[] | []> => {
  return UserModel.find(filter).select(selectFields).exec();
};

export default { findByEmail, fullName, findById, sanitizedUser, findAll };
