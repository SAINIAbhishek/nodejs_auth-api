import express from 'express';
import validator, { ValidationSource } from '../../helpers/Validator';
import {
  USER_JOI_CREATE_SCHEMA,
  USER_JOI_ID_SCHEMA,
} from '../../models/UserModel';
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
    UserController.createNewUser
  )
  .get(UserController.getAllUsers);

router.use('/:id', validator(USER_JOI_ID_SCHEMA, ValidationSource.PARAM));

router
  .route('/:id')
  .get(UserController.getUser)
  .delete(UserController.deleteUser);

export default router;
