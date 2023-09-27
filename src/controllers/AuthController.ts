import asyncHandler from 'express-async-handler';
import Logger from '../middleware/Logger';
import {
  ManyRequestResponse,
  SuccessMsgResponse,
  SuccessResponse,
  TokenRefreshResponse,
} from '../middleware/ApiResponse';
import UserHelper from '../helpers/UserHelper';
import { AuthFailureError, BadRequestError } from '../middleware/ApiError';
import bcrypt from 'bcrypt';
import AuthHelper from '../helpers/AuthHelper';
import { COOKIE, LIMITER, TOKEN_INFO } from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { ProtectedRequest } from 'app-request';
import { UserModel } from '../models/UserModel';

class AuthController {
  test = asyncHandler(async (_, res) => {
    Logger.info('User test');
    new SuccessResponse('Test successfully!', {}).send(res);
  });

  loginLimiter = rateLimit({
    windowMs: LIMITER.loginWS,
    max: LIMITER.loginMaxAttempt,
    message: 'Too many login attempts, please try again later.',
    handler: (req, res, _, options) => {
      Logger.info(`${options.message}, Method: ${req.method}, Url: ${req.url}`);
      new ManyRequestResponse(options.message).send(res);
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  isAuthorized = asyncHandler(async (req: ProtectedRequest, _, next) => {
    const token = AuthHelper.getAccessToken(req.headers.authorization);
    const accessTokenPayload = jwt.verify(
      token,
      TOKEN_INFO.accessTokenSecret
    ) as JwtPayload;

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

    // hash password
    const hashedPassword = await AuthHelper.generateHashPassword(password);

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

  login = asyncHandler(async (req, res) => {
    const user = await UserHelper.findByEmail(req.body.email, '+password');
    if (!user || !user.password)
      throw new BadRequestError(
        'Your email address or your password is incorrect'
      );

    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched)
      throw new AuthFailureError('Your credentials are incorrect');

    const tokens: Token = AuthHelper.createTokens(user);

    // create secure cookie with refresh token
    res.cookie(COOKIE.login, tokens.refreshToken, {
      httpOnly: true, // //accessible only by web server
      secure: true, // https
      sameSite: true, // cross-site cookie
      maxAge: COOKIE.maxAge, // cookie expiry: set to match refreshTokenValidity
    });

    new SuccessResponse('User logged in successfully', {
      token: tokens.accessToken,
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

    new TokenRefreshResponse('Token issued', tokens.accessToken).send(res);
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
