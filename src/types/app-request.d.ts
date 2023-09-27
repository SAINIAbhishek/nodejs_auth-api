import { Request } from 'express';
import User from '../models/UserModel';
import { JwtPayload } from 'jsonwebtoken';

declare interface ProtectedRequest extends Request {
  session: {
    accessToken?: string;
    refreshToken?: string;
    refreshTokenPayload?: JwtPayload;
    accessTokenPayload?: JwtPayload;
    user?: User;
  };
}

declare interface Token {
  accessToken: string;
  refreshToken: string;
}
