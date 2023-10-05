import User, { UserModel } from '../models/UserModel';
import { PopulateOptions, Types } from 'mongoose';
import Role from '../models/RoleModel';
import RoleHelper from './RoleHelper';

const fullName = (firstname?: string, lastname?: string) => {
  return `${firstname || ''}${lastname ? ' ' + lastname : ''}`;
};

const sanitizedUser = (user: User, roles: Role[] = []): User => {
  return {
    _id: user._id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    name: fullName(user.firstname, user.lastname),
    roles: !!roles.length ? RoleHelper.sanitizedRoles(roles) : user.roles ?? [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const findById = async (
  id: string,
  selectFields = '',
  populates: PopulateOptions[] = []
): Promise<User | null> => {
  return UserModel.findOne({ _id: new Types.ObjectId(id) })
    .select(selectFields)
    .populate(populates)
    .exec();
};

const findByEmail = async (
  email: string,
  selectFields = '',
  populates: PopulateOptions[] = []
): Promise<User | null> => {
  return UserModel.findOne({ email: email })
    .select(selectFields)
    .populate(populates)
    .exec();
};

const findAll = async (
  filter: object = {},
  selectFields = '',
  populates: PopulateOptions[] = []
): Promise<User[] | []> => {
  return UserModel.find(filter).select(selectFields).populate(populates).exec();
};

export default { findByEmail, fullName, findById, sanitizedUser, findAll };
