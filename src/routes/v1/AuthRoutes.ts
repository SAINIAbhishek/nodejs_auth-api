import express from 'express';
import validator, { ValidationSource } from '../../helpers/Validator';
import {
  USER_JOI_LOGIN_SCHEMA,
  USER_JOI_REGISTER_SCHEMA,
} from '../../models/UserModel';
import AuthController from '../../controllers/AuthController';
import { AUTH_JOI_SCHEMA } from '../../helpers/AuthHelper';
import UserController from '../../controllers/UserController';

const router = express.Router();

router
  .route('/login')
  .post(validator(USER_JOI_LOGIN_SCHEMA), AuthController.login);

router
  .route('/register')
  .post(validator(USER_JOI_REGISTER_SCHEMA), UserController.register);

router.route('/logout').post(AuthController.logout);

router
  .route('/refresh')
  .post(
    validator(AUTH_JOI_SCHEMA, ValidationSource.HEADER),
    AuthController.isAuthorized,
    AuthController.refreshToken
  );

// http://localhost:3001/api/v1/oauth/test
router.get('/test', AuthController.test);

export default router;
