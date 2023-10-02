import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Logger from '../middleware/Logger';
import { BadRequestError } from '../middleware/ApiError';

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error('any.invalid');
    return value;
  }, 'Object Id Validation');

export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith('Bearer ')) return helpers.error('any.invalid');
    if (!value.split(' ')[1]) return helpers.error('any.invalid');
    return value;
  }, 'Authorization Header Validation');

/**
 * to validate incoming requests to ensure that they have a valid JWT token in
 * the authorization header. If the header is missing or doesn't match the
 * expected format, Joi will reject the request.
 */
export const JOI_AUTHORIZATION_SCHEMA: Joi.ObjectSchema = Joi.object({
  authorization: JoiAuthBearer().required(),
}).unknown(true);

export const JOI_EMAIL_SCHEMA: Joi.ObjectSchema = Joi.object({
  email: Joi.string().min(5).max(255).email().required(),
});

export const JOI_TOKEN_SCHEMA: Joi.ObjectSchema = Joi.object({
  token: Joi.string().required(),
});

export const JOI_ID_SCHEMA: Joi.ObjectSchema = Joi.object({
  id: JoiObjectId().required(),
});

export default (
    schema: Joi.AnySchema,
    source: ValidationSource = ValidationSource.BODY
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[source]);

      if (!error) return next();

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ''))
        .join(',');

      Logger.error(message);

      next(new BadRequestError(message));
    } catch (error) {
      next(error);
    }
  };
