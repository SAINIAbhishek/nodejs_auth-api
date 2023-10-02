import express from 'express';
import validator, {
  JOI_AUTHORIZATION_SCHEMA,
  JOI_ID_SCHEMA,
  ValidationSource,
} from '../../helpers/Validator';
import {
  JOI_USER_CREATE_SCHEMA,
  JOI_USER_UPDATE_SCHEMA,
} from '../../models/UserModel';
import UserController from '../../controllers/UserController';
import AuthController from '../../controllers/AuthController';

const router = express.Router();

router.use(
  validator(JOI_AUTHORIZATION_SCHEMA, ValidationSource.HEADER),
  AuthController.isAuthorized
);

router
  .route('/')
  .post(
    validator(JOI_USER_CREATE_SCHEMA, ValidationSource.BODY),
    UserController.createNewUser
  )
  .get(UserController.getAllUsers);

router.use('/:id', validator(JOI_ID_SCHEMA, ValidationSource.PARAM));

router
  .route('/:id')
  .get(UserController.getUser)
  .put(
    validator(JOI_USER_UPDATE_SCHEMA, ValidationSource.BODY),
    UserController.updateUser
  )
  .delete(UserController.deleteUser);

export default router;
