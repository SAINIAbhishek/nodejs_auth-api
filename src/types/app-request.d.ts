import { Request } from 'express';
import User from '../models/UserModel';

declare interface ProtectedRequest extends Request {
  user?: User;
}

declare interface Token {
  accessToken: string;
  refreshToken: string;
}
