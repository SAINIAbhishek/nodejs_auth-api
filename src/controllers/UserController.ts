import asyncHandler from 'express-async-handler';
import UserHelper from '../helpers/UserHelper';
import { BadRequestError } from '../middleware/ApiError';
import { UserModel } from '../models/UserModel';
import { SuccessResponse } from '../middleware/ApiResponse';
import AuthHelper from '../helpers/AuthHelper';

class UserController {
  create = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    const user = await UserHelper.findByEmail(email);
    if (user) throw new BadRequestError('User already exists');

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

  getAll = asyncHandler(async (_, res) => {
    let users = await UserHelper.findAll();
    users = users.map((user) => UserHelper.sanitizedUser(user));

    new SuccessResponse('Users fetched successfully', {
      user: users,
      total: users.length,
    }).send(res);
  });
}

export default new UserController();
