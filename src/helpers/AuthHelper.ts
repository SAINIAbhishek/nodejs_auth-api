import User from '../models/UserModel';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthFailureError, InternalError } from '../middleware/ApiError';
import { TOKEN_INFO } from '../config';
import UserHelper from './UserHelper';
import crypto from 'crypto';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * to hash a given password with a generated salt
 * @param password
 */
const generateHashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * to check whether the user's password has been updated more recently than
 * the timestamp of the token's issuance (iat), and it throws an
 * AuthFailureError if the password has been updated recently.
 * @param payload
 * @param user
 */
const validatePasswordUpdate = (payload: JwtPayload, user: User): void => {
  if (user?.passwordUpdatedAt) {
    const tokenIatTimestamp = payload.iat ?? 0;
    const pwdTimestamp = new Date(user.passwordUpdatedAt).getTime() / 1000; // converting it into milliseconds

    if (pwdTimestamp > tokenIatTimestamp) {
      throw new AuthFailureError(
        'Password has been updated recently, please login again.'
      );
    }
  }
};

/**
 * to generates a random key by creating a sequence of random bytes and
 * converting them to a hexadecimal string.
 */
const generateTokenKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * to generate a hash (digest) of a given key using the SHA-256 hashing algorithm
 * @param key
 */
const generateHashTokenKey = (key: string) => {
  return crypto.createHash('sha256').update(key).digest('hex');
};

/**
 * is responsible for extracting the access token from an authorization header
 * that uses the "Bearer" token type.
 *
 * It ensures that there is an authorization header (authorization parameter is not empty).
 * It checks if the authorization header starts with "Bearer ".
 * If the checks pass, it returns the extracted access token.
 * @param authorization
 */
const getAccessToken = (authorization?: string) => {
  if (!authorization) throw new AuthFailureError('Unauthorized');
  if (!authorization.startsWith('Bearer '))
    throw new AuthFailureError('Unauthorized');
  return authorization.split(' ')[1];
};

/**
 * It checks for the existence of the essential JWT claims (iss, sub, aud, iat, and exp),
 * verifies that they match your expected values (issuer, audience),
 * ensures that the sub claim is a valid MongoDB ObjectId, and checks
 * If any of these checks fail, it throws an AuthFailureError.
 * @param payload
 * @param message
 */
const validateTokenData = (
  payload: JwtPayload,
  message = 'Invalid Token'
): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.iat ||
    !payload.exp ||
    payload.iss !== TOKEN_INFO.issuer ||
    payload.aud !== TOKEN_INFO.audience ||
    !Types.ObjectId.isValid(payload.sub)
  ) {
    throw new AuthFailureError(message);
  }
  return true;
};

/**
 * generates both access and refresh tokens for a given user based on the
 * provided user object. It also includes the user's ID, name, and
 * token-related information such as issuer (iss), issued at (iat), and
 * audience (aud).
 * @param user
 */
const createTokens = (user: User): Token => {
  // Payload for both access and refresh tokens
  const payload = {
    sub: user._id?.toString(),
    name: UserHelper.fullName(user.firstname, user.lastname),
    iss: TOKEN_INFO.issuer,
    iat: Math.floor(Date.now() / 1000),
    aud: TOKEN_INFO.audience,
  };

  // Generate the access token using the access token secret and validity period
  const accessToken = jwt.sign(payload, TOKEN_INFO.accessTokenSecret, {
    expiresIn: TOKEN_INFO.accessTokenValidity,
  });

  if (!accessToken) throw new InternalError();

  // Generate the refresh token using the refresh token secret and validity period
  const refreshToken = jwt.sign(payload, TOKEN_INFO.refreshTokenSecret, {
    expiresIn: TOKEN_INFO.refreshTokenValidity,
  });

  if (!refreshToken) throw new InternalError();

  return {
    accessToken,
    refreshToken,
  } as Token;
};

export default {
  createTokens,
  generateTokenKey,
  validateTokenData,
  getAccessToken,
  validatePasswordUpdate,
  generateHashPassword,
  generateHashTokenKey,
};
