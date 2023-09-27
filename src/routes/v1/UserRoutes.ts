import express from 'express';
import validator, { ValidationSource } from '../../helpers/Validator';
import { USER_JOI_CREATE_SCHEMA } from '../../models/UserModel';
import UserController from '../../controllers/UserController';
import { AUTH_JOI_SCHEMA } from '../../helpers/AuthHelper';
import AuthController from '../../controllers/AuthController';

const router = express.Router();

router.use(
  validator(AUTH_JOI_SCHEMA, ValidationSource.HEADER),
  AuthController.isAuthorized
);

router
  .route('/')
  .post(
    validator(USER_JOI_CREATE_SCHEMA, ValidationSource.BODY),
    UserController.create
  )
  .get(UserController.getAll);

export default router;
