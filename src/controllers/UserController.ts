import asyncHandler from 'express-async-handler';
import UserHelper from '../helpers/UserHelper';
import {
  BadRequestError,
  InternalError,
  NotFoundError,
} from '../middleware/ApiError';
import { UserModel } from '../models/UserModel';
import { SuccessResponse } from '../middleware/ApiResponse';
import AuthHelper from '../helpers/AuthHelper';
import RoleHelper from '../helpers/RoleHelper';
import { RoleNameEnum } from '../models/RoleModel';

class UserController {
  createNewUser = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    const user = await UserHelper.findByEmail(email);
    if (user) throw new BadRequestError('User already exists');

    const role = await RoleHelper.findByName(RoleNameEnum.USER, '+name');
    if (!role) throw new InternalError('Role must be defined');

    // hash password
    const hashedPassword = await AuthHelper.generateHashPassword(password);

    const userObj = {
      email,
      password: hashedPassword,
      firstname,
      lastname,
    };

    const newUser = await UserModel.create(userObj);

    new SuccessResponse('User created successfully', {
      user: UserHelper.sanitizedUser(newUser),
    }).send(res);
  });

  getAllUsers = asyncHandler(async (_, res) => {
    let users = await UserHelper.findAll();
    users = users.map((user) => UserHelper.sanitizedUser(user));

    new SuccessResponse('Users fetched successfully', {
      total: users.length,
      user: users,
    }).send(res);
  });

  getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = (!!id && (await UserHelper.findById(id))) || null;
    if (!user) throw new NotFoundError('User not found');

    new SuccessResponse('User fetched successfully', {
      user: UserHelper.sanitizedUser(user),
    }).send(res);
  });

  updateUser = asyncHandler(async (req, res) => {
    const { email, firstname, lastname } = req.body;
    const updateFields: { [key: string]: any } = { email, firstname, lastname };

    // Remove undefined fields
    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key],
    );

    const { id } = req.params;

    const updatedUser = await UserHelper.findByIdAndUpdate(id, updateFields);

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    new SuccessResponse('User updated successfully', {
      user: UserHelper.sanitizedUser(updatedUser),
    }).send(res);
  });

  deleteUser = asyncHandler(async (req, res) => {
    const result: DeleteResult = await UserModel.deleteOne({
      _id: req.params.id,
    });
    if (!result.deletedCount) throw new NotFoundError('User not found');

    new SuccessResponse('User deleted successfully', {
      userId: req.params.id,
    }).send(res);
  });
}

export default new UserController();
