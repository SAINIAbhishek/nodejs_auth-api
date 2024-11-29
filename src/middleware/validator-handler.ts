import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { BadRequestError } from '../services/error-service';
import logger from './logging-handler';
import regex from '../config/regex-config';

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}

/**
 * Custom Joi validation schema for MongoDB ObjectId.
 * Ensures that the provided string is a valid ObjectId.
 */
const joiObjectId = (): Joi.StringSchema<string> =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Object Id Validation');

/**
 * Custom Joi validation schema for Bearer Authorization headers.
 * Ensures the authorization header contains a valid Bearer token.
 */
const joiAuthBearer = (): Joi.StringSchema<string> =>
  Joi.string().custom((value: string, helpers) => {
    if (!value?.startsWith('Bearer ') || !value?.split(' ')[1]) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Authorization Header Validation');

/**
 * Joi schema for validating Authorization headers with Bearer tokens.
 */
export const joiAuthorizationSchema: Joi.ObjectSchema = Joi.object({
  authorization: joiAuthBearer().required(),
}).unknown(true);

/**
 * Joi schema for validating email addresses.
 */
export const joiEmailSchema: Joi.ObjectSchema = Joi.object({
  email: Joi.string().min(5).max(255).email().required(),
});

/**
 * Joi schema for validating tokens.
 */
export const joiTokenSchema: Joi.ObjectSchema = Joi.object({
  token: Joi.string().required(),
});

/**
 * Joi schema for validating MongoDB ObjectId values.
 */
export const joiIdSchema: Joi.ObjectSchema = Joi.object({
  id: joiObjectId().required(),
});

/**
 * Middleware to validate incoming requests based on a provided Joi schema.
 * @param schema - Joi schema to validate against.
 * @param source - The source of the data to validate (e.g., body, query, params).
 * @returns Express middleware function.
 */
const validatorHandler =
  (schema: Joi.AnySchema, source: ValidationSource = ValidationSource.BODY) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const { error } = schema.validate(req[source]);

      if (!error) {
        return next();
      }

      const message = error.details
        .map((detail) => detail.message.replace(regex.removeQuotes, ''))
        .join(', ');

      logger.error(`Validation error: ${message}`);

      next(new BadRequestError(message));
    } catch (error) {
      next(error);
    }
  };

export default validatorHandler;
