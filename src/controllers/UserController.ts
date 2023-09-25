import asyncHandler from 'express-async-handler';
import UserHelper from '../helpers/UserHelper';
import { BadRequestError } from '../middleware/ApiError';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/UserModel';
import { SuccessResponse } from '../middleware/ApiResponse';
import AuthHelper from '../helpers/AuthHelper';
import { Token } from 'app-request';

class UserController {
  register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    const user = await UserHelper.findByEmail(email);
    if (user) throw new BadRequestError('User already registered');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userObj = {
      email,
      password: hashedPassword,
      firstname,
      lastname,
    };

    const newUser = await UserModel.create(userObj);
    const tokens: Token = AuthHelper.createTokens(newUser);

    new SuccessResponse('User registered successfully', {
      token: tokens.accessToken,
      user: UserHelper.sanitizedUser(newUser),
    }).send(res);
  });
}

export default new UserController();
