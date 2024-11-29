import asyncHandler from 'express-async-handler';
import Logger from '../middleware/Logger';
import {
  SuccessMsgResponse,
  SuccessResponse,
  TokenRefreshResponse,
} from '../middleware/ApiResponse';
import UserHelper from '../helpers/UserHelper';
import { AuthFailureError, BadRequestError, InternalError } from '../middleware/ApiError';
import bcrypt from 'bcrypt';
import AuthHelper from '../helpers/AuthHelper';
import { COOKIE, LIMITER, TOKEN_INFO } from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ProtectedRequest } from 'app-request';
import { UserModel } from '../models/UserModel';
import { RoleNameEnum, RoleStatusEnum } from '../models/RoleModel';
import RoleHelper from '../helpers/RoleHelper';
import LimiterHelper from '../helpers/LimiterHelper';

class AuthController {
  forgotPasswordLimiter = LimiterHelper.createRateLimiter({
    windowMs: LIMITER.forgotPasswordWS,
    max: LIMITER.forgotPasswordMaxAttempt,
    message: 'Too many reset password attempts, please try again later.',
  });

  forgotPassword = asyncHandler(async (req: ProtectedRequest, res, next) => {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      Logger.info(`Attempted password reset for non-existent email: ${email}`);
      new SuccessResponse(
        'If the email exists you will receive the email to reset the password.',
        {}
      ).send(res);
    } else {
      // a unique reset token
      const resetToken = AuthHelper.generateTokenKey();

      // Storing the raw reset token to send through email.
      user.passwordResetTokenRaw = resetToken;

      // will use this one to compare the token when it's provided during the reset process.
      user.passwordResetToken = AuthHelper.generateHashTokenKey(resetToken);

      // Setting the expiration date of a reset token
      user.passwordResetTokenExpires = new Date(
        Date.now() + TOKEN_INFO.passwordResetTokenValidity
      ).toString();

      await user.save({ validateBeforeSave: false });

      req.email = {
        user,
      };

      next();
    }
  });

  resetPassword = asyncHandler(async (req: ProtectedRequest, _, next) => {
    const { password, email } = req.body;
    const { token } = req.params ?? '';

    let filter = {
      passwordResetTokenRaw: token,
      passwordResetToken: token,
      email: email,
      passwordResetTokenExpires: { $gt: Date.now() },
    };

    if (!token) {
      Logger.info(`Attempted password reset, ${JSON.stringify(filter)}`);
      throw new BadRequestError('Token is invalid or has been expired.');
    }

    filter = {
      ...filter,
      passwordResetToken: AuthHelper.generateHashTokenKey(token),
    };

    const user = await UserModel.findOne(filter);

    if (!user) {
      Logger.info(`Attempted password reset, ${JSON.stringify(filter)}`);
      throw new BadRequestError('Token is invalid or has been expired.');
    }

    user.passwordResetToken = undefined;
    user.passwordResetTokenRaw = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordUpdatedAt = Date.now().toString();
    user.password = await AuthHelper.generateHashPassword(password);

    await user.save();

    req.email = {
      isPasswordUpdated: true,
      user: user,
    };

    next();
  });

  loginLimiter = LimiterHelper.createRateLimiter({
    windowMs: LIMITER.loginWS,
    max: LIMITER.loginMaxAttempt,
    message: 'Too many login attempts, please try again later.',
  });

  isAuthorized = asyncHandler(async (req: ProtectedRequest, _, next) => {
    const token = AuthHelper.getAccessToken(req.headers.authorization) || '';
    const accessTokenPayload = jwt.verify(token, TOKEN_INFO.accessTokenSecret) as JwtPayload;

    AuthHelper.validateTokenData(accessTokenPayload, 'Unauthorized');

    const userId = accessTokenPayload.sub ?? '';
    const user = await UserHelper.findById(userId, '+passwordUpdatedAt');
    if (!user) throw new AuthFailureError('Unauthorized');

    AuthHelper.validatePasswordUpdate(accessTokenPayload, user);

    // attaching the information to the session object to use in next middleware function
    req.session = {
      ...req.session,
      accessToken: token,
      accessTokenPayload,
      user: UserHelper.sanitizedUser(user),
    };

    next();
  });

  register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    const user = await UserHelper.findByEmail(email);
    if (user) throw new BadRequestError('User already registered');

    const role = await RoleHelper.findByName(RoleNameEnum.USER, '+name');
    if (!role) throw new InternalError('Role must be defined');

    // hash password
    const hashedPassword = await AuthHelper.generateHashPassword(password);

    const userObj = {
      email,
      password: hashedPassword,
      firstname,
      lastname,
      roles: [role],
    };

    await UserModel.create(userObj);

    new SuccessResponse('The user has been registered successfully', {}).send(res);
  });

  login = asyncHandler(async (req, res) => {
    const user = await UserHelper.findByEmail(req.body.email, '+password', [
      {
        path: 'roles',
        match: { status: RoleStatusEnum.ACTIVE },
        select: '-createdAt -updatedAt',
      },
    ]);

    if (!user?.password) {
      throw new BadRequestError('Your email address or password is incorrect');
    }

    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched) throw new AuthFailureError('Your credentials are incorrect');

    const tokens: Token = AuthHelper.createTokens(user);

    // create secure cookie with refresh token
    res.cookie(COOKIE.login, tokens.refreshToken, {
      httpOnly: true, // accessible only by web server
      secure: true, // https
      sameSite: true, // cross-site cookie
      maxAge: COOKIE.maxAge, // cookie expiry: set to match refreshTokenValidity
    });

    new SuccessResponse('User logged in successfully', {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      user: UserHelper.sanitizedUser(user),
    }).send(res);
  });

  refreshToken = asyncHandler(async (req: ProtectedRequest, res) => {
    const refreshToken = (req.cookies && req.cookies[COOKIE.login]) ?? null;
    if (!refreshToken) throw new AuthFailureError('Unauthorized');

    const refreshTokenPayload = jwt.verify(
      refreshToken,
      TOKEN_INFO.refreshTokenSecret
    ) as JwtPayload;

    AuthHelper.validateTokenData(refreshTokenPayload);

    const userId = refreshTokenPayload.sub ?? '';
    const user = await UserHelper.findById(userId, '+passwordUpdatedAt');
    if (!user) throw new AuthFailureError('Unauthorized');

    AuthHelper.validatePasswordUpdate(refreshTokenPayload, user);

    const tokens: Token = AuthHelper.createTokens(user);

    new TokenRefreshResponse('Token issued', {
      tokens: {
        accessToken: tokens.accessToken,
      },
      user: UserHelper.sanitizedUser(user),
    }).send(res);
  });

  logout = asyncHandler(async (req, res) => {
    const refreshToken = (req.cookies && req.cookies[COOKIE.login]) ?? null;

    if (!!refreshToken) {
      res.clearCookie(COOKIE.login, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    }

    new SuccessMsgResponse('User logged out successfully').send(res);
  });
}

export default new AuthController();
