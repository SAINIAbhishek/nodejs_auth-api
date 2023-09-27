import express from 'express';
import validator, { ValidationSource } from '../../helpers/Validator';
import {
  USER_JOI_LOGIN_SCHEMA,
  USER_JOI_REGISTER_SCHEMA,
} from '../../models/UserModel';
import AuthController from '../../controllers/AuthController';
import { AUTH_JOI_SCHEMA } from '../../helpers/AuthHelper';

const router = express.Router();

// http://localhost:3001/api/v1/oauth/test
router.get('/test', AuthController.test);

router
  .route('/login')
  .post(
    validator(USER_JOI_LOGIN_SCHEMA, ValidationSource.BODY),
    AuthController.loginLimiter,
    AuthController.login
  );

router
  .route('/register')
  .post(
    validator(USER_JOI_REGISTER_SCHEMA, ValidationSource.BODY),
    AuthController.register
  );

router.route('/logout').post(AuthController.logout);

router
  .route('/refresh')
  .post(
    validator(AUTH_JOI_SCHEMA, ValidationSource.HEADER),
    AuthController.isAuthorized,
    AuthController.refreshToken
  );

export default router;
