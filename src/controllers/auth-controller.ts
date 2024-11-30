import asyncHandler from 'express-async-handler';
import logger from '../middleware/logging-handler';
import {
  SuccessMsgResponse,
  SuccessResponse,
  TokenRefreshResponse,
} from '../services/response-service';
import {
  createTokens,
  generateHashTokenKey,
  generateTokenKey,
  getAccessToken,
  validatePasswordUpdate,
  validateTokenData,
} from '../helpers/auth-helper';
import config from '../config';
import UserModel from '../models/user-model';
import { NextFunction, Request, Response } from 'express';
import { defaultRolePopulate } from '../helpers/role-helper';
import { AuthFailureError, BadRequestError, InternalError } from '../services/error-service';
import bcrypt from 'bcrypt';
import { Token } from '../types/token-type';
import { sanitizedUser } from '../helpers/user-helper';
import AuthService from '../services/auth-service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RoleModel } from '../models/role-model';
import { RoleNameEnum } from '../types/role-type';

class AuthController {
  forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      logger.info(`Attempted password reset for non-existent email: ${email}`);

      new SuccessMsgResponse(
        'If the email exists, you will receive an email to reset the password.'
      ).send(res);
    } else {
      const resetToken = generateTokenKey();

      user.passwordResetTokenRaw = resetToken; // Raw token for email
      user.passwordResetToken = generateHashTokenKey(resetToken); // Hashed token for storage
      user.passwordResetTokenExpires = new Date(
        Date.now() + config.token.passwordResetTokenValidity
      ).toString();

      await user.save({ validateBeforeSave: false });

      req.user = {
        id: user._id.toString() ?? '',
        email: email,
        firstname: user.firstname ?? '',
        passwordResetTokenRaw: user.passwordResetTokenRaw,
      };
    }

    next();
  });

  resetPassword = asyncHandler(async (req: Request, _res: Response, next) => {
    const { password, email } = req.body;
    const { token } = req.params;

    let filter = {
      passwordResetTokenRaw: token,
      passwordResetToken: token,
      email: email,
      passwordResetTokenExpires: { $gt: Date.now() },
    };

    if (!token) {
      logger.info(`Attempted password reset, ${JSON.stringify(filter)}`);
      throw new BadRequestError('Token is invalid or has been expired.');
    }

    filter = {
      ...filter,
      passwordResetToken: generateHashTokenKey(token),
    };

    const user = await UserModel.findOne(filter);

    if (!user) {
      logger.info(`Attempted password reset, ${JSON.stringify(filter)}`);
      throw new BadRequestError('Token is invalid or has been expired.');
    }

    user.passwordResetToken = undefined;
    user.passwordResetTokenRaw = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordUpdatedAt = Date.now().toString();

    user.password = await AuthService.generateHashPassword(password);

    await user.save();

    req.user = {
      id: user._id.toString() ?? '',
      email: email,
      firstname: user.firstname ?? '',
    };

    req.resetPassword = {
      isPasswordUpdated: true,
    };

    next();
  });

  isAuthorized = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const token = getAccessToken(authorization);

    if (!token) {
      throw new AuthFailureError('Authorization token is missing');
    }

    const accessTokenPayload = jwt.verify(token, config.token.accessTokenSecret) as JwtPayload;
    validateTokenData(accessTokenPayload, 'Unauthorized');

    const userId = accessTokenPayload.sub ?? '';
    const user = await UserModel.findById(userId).select('+passwordUpdatedAt').lean().exec();

    if (!user) {
      throw new AuthFailureError('User not found');
    }

    validatePasswordUpdate(accessTokenPayload, user);

    req.session = {
      ...req.session,
      accessToken: token,
      userId: userId,
    };

    next();
  });

  register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    const existingUser = await UserModel.findOne({ email: email }).lean().exec();
    if (existingUser) {
      logger.info(`Attempted user register for already registered, ${email}`);
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
      roles: [role],
    };

    await UserModel.create(userObj);

    new SuccessMsgResponse('The user has been registered successfully').send(res);
  });

  login = asyncHandler(async (req, res) => {
    const email = req.body.email;

    const user = await UserModel.findOne({ email: email })
      .select('+password')
      .populate(defaultRolePopulate)
      .lean()
      .exec();

    if (!user?.password) {
      throw new BadRequestError('Your email address or password is incorrect');
    }

    const isMatched = await bcrypt.compare(req.body.password, user.password);

    if (!isMatched) {
      throw new AuthFailureError('Your credentials are incorrect');
    }

    const tokens: Token = createTokens(user);
    res.cookie(config.cookie.login, tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: config.cookie.maxAge,
    });

    new SuccessResponse('User logged in successfully', {
      tokens,
      user: sanitizedUser(user),
    }).send(res);
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = (req.cookies && req.cookies[config.cookie.login]) ?? null;

    if (!refreshToken) {
      throw new AuthFailureError('Refresh token is missing');
    }

    const refreshTokenPayload = jwt.verify(
      refreshToken,
      config.token.refreshTokenSecret
    ) as JwtPayload;

    validateTokenData(refreshTokenPayload);

    const userId = refreshTokenPayload.sub ?? '';
    const user = await UserModel.findById(userId)
      .select('+passwordUpdatedAt')
      .populate(defaultRolePopulate)
      .lean()
      .exec();

    if (!user) {
      throw new AuthFailureError('User not found');
    }

    validatePasswordUpdate(refreshTokenPayload, user);

    const tokens: Token = createTokens(user);

    new TokenRefreshResponse('Token issued', {
      tokens: {
        accessToken: tokens.accessToken,
      },
      user: sanitizedUser(user),
    }).send(res);
  });

  logout = asyncHandler(async (req, res) => {
    const refreshToken = (req.cookies && req.cookies[config.cookie.login]) ?? null;

    if (refreshToken) {
      res.clearCookie(config.cookie.login, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    }
    new SuccessMsgResponse('User logged out successfully').send(res);
  });
}

export default new AuthController();
