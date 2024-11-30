import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { Types } from 'mongoose';
import { AuthFailureError, InternalError } from '../services/error-service';
import config from '../config';
import { TokenPayload, Token } from '../types/token-type';
import { fullName } from './user-helper';
import { User } from '../types/user-type';

/**
 * Validates if the user's password has been updated after the token was issued.
 * Throws AuthFailureError if the password has been updated recently.
 * @param payload The JWT payload containing the token's issuance time (iat).
 * @param user The user object with the user's password updated timestamp.
 */
export const validatePasswordUpdate = (payload: JwtPayload, user: User): void => {
  if (user?.passwordUpdatedAt) {
    const tokenIatTimestamp = payload.iat ?? 0;
    const pwdTimestamp = new Date(user.passwordUpdatedAt).getTime() / 1000; // converting it into milliseconds

    if (pwdTimestamp > tokenIatTimestamp) {
      throw new AuthFailureError('Password has been updated recently, please login again.');
    }
  }
};

/**
 * Generates a random 64-byte key and returns it as a hexadecimal string.
 * @returns A random hexadecimal key.
 */
export const generateTokenKey = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Hashes a given key using the SHA-256 algorithm.
 * @param key The key to be hashed.
 * @returns The hashed key.
 */
export const generateHashTokenKey = (key: string): string => {
  return crypto.createHash('sha256').update(key).digest('hex');
};

/**
 * Extracts the access token from the 'Authorization' header in the request.
 * Throws an AuthFailureError if the header is invalid or missing.
 * @param authorization The Authorization header value.
 * @returns The extracted access token.
 */
export const getAccessToken = (authorization?: string): string | undefined => {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthFailureError('Unauthorized');
  }
  return authorization.split(' ')[1];
};

/**
 * Validates essential JWT claims (iss, sub, aud, iat, and exp) in the token payload.
 * Ensures sub is a valid MongoDB ObjectId.
 * @param payload The JWT payload to validate.
 * @param message The error message to use if validation fails.
 * @returns true if the token data is valid.
 * @throws AuthFailureError if any claim is invalid.
 */
export const validateTokenData = (payload: JwtPayload, message = 'Invalid Token'): boolean => {
  const { iss, sub, aud, iat, exp } = payload;

  if (
    !iss ||
    !sub ||
    !aud ||
    !iat ||
    !exp ||
    iss !== config.token.issuer ||
    aud !== config.token.audience ||
    !Types.ObjectId.isValid(sub)
  ) {
    throw new AuthFailureError(message);
  }
  return true;
};

/**
 * Generates a JWT token with the given payload, secret, and expiration time.
 * @param payload The payload to include in the token.
 * @param secret The secret key to sign the token.
 * @param expiresIn The expiration time of the token in seconds.
 * @returns The generated JWT token.
 * @throws InternalError if token generation fails.
 */
const generateToken = (payload: TokenPayload, secret: string, expiresIn: number): string => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  if (!token) {
    throw new InternalError();
  }
  return token;
};

/**
 * Creates both access and refresh tokens for a given user.
 * @param user The user object for which to generate tokens.
 * @returns An object containing the access and refresh tokens.
 */
export const createTokens = (user: User): Token => {
  const payload = {
    sub: user._id?.toString() || '',
    name: fullName(user.firstname, user.lastname),
    iss: config.token.issuer,
    iat: Math.floor(Date.now() / 1000), // Current timestamp in seconds
    aud: config.token.audience,
  };

  const accessToken = generateToken(
    payload,
    config.token.accessTokenSecret,
    config.token.accessTokenValidity
  );

  const refreshToken = generateToken(
    payload,
    config.token.refreshTokenSecret,
    config.token.refreshTokenValidity
  );

  return {
    accessToken,
    refreshToken,
  };
};
