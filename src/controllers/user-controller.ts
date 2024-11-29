import asyncHandler from 'express-async-handler';
import UserModel from '../models/user-model';
import { BadRequestError, InternalError, NotFoundError } from '../services/error-service';
import { RoleModel } from '../models/role-model';
import { RoleNameEnum } from '../types/role-type';
import AuthService from '../services/auth-service';
import { SuccessResponse } from '../services/response-service';
import { sanitizedUser } from '../helpers/user-helper';
import { UserUpdate } from '../types/user-type';
import { defaultRolePopulate } from '../helpers/role-helper';

class UserController {
  createNewUser = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      throw new BadRequestError('User already registered');
    }

    const role = await RoleModel.findOne({ name: RoleNameEnum.USER }).lean().exec();
    if (!role) {
      throw new InternalError('Role must be defined');
    }

    const hashedPassword = await AuthService.generateHashPassword(password);

    const userObj = {
      email,
      password: hashedPassword,
      firstname,
      lastname,
      roles: [role._id],
    };

    const newUser = await UserModel.create(userObj);

    new SuccessResponse('User created successfully', {
      user: sanitizedUser(newUser, [role]),
    }).send(res);
  });

  getAllUsers = asyncHandler(async (_, res) => {
    const users = await UserModel.find().populate(defaultRolePopulate).lean().exec();

    new SuccessResponse('Users fetched successfully', {
      total: users.length,
      user: users.map((user) => sanitizedUser(user)),
    }).send(res);
  });

  getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id).populate(defaultRolePopulate).lean().exec();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    new SuccessResponse('User fetched successfully', {
      user: sanitizedUser(user),
    }).send(res);
  });

  updateUser = asyncHandler(async (req, res) => {
    const { email, firstname, lastname } = req.body;

    const updateFields: UserUpdate = { email, firstname, lastname };

    // Remove undefined fields
    Object.keys(updateFields).forEach(
      (key) =>
        updateFields[key as keyof UserUpdate] === undefined &&
        delete updateFields[key as keyof UserUpdate]
    );

    const { id } = req.params;
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateFields, { new: true })
      .populate(defaultRolePopulate)
      .lean()
      .exec();

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    new SuccessResponse('User updated successfully', {
      user: sanitizedUser(updatedUser),
    }).send(res);
  });

  deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await UserModel.deleteOne({ _id: id }).lean().exec();

    if (!result.deletedCount) {
      throw new NotFoundError('User not found');
    }

    new SuccessResponse('User deleted successfully', {
      userId: id,
    }).send(res);
  });
}

export default new UserController();
