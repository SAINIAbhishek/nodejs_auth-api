import express from 'express';
import validator, {
  JOI_AUTHORIZATION_SCHEMA,
  JOI_EMAIL_SCHEMA,
  JOI_TOKEN_SCHEMA,
  ValidationSource,
} from '../../helpers/Validator';
import {
  JOI_USER_LOGIN_SCHEMA,
  JOI_USER_REGISTER_SCHEMA,
  JOI_USER_RESET_PASSWORD_SCHEMA,
} from '../../models/UserModel';
import AuthController from '../../controllers/AuthController';
import EmailController from '../../controllers/EmailController';

const router = express.Router();

// http://localhost:3001/api/v1/oauth/test
router.get('/test', AuthController.test);

router
  .route('/login')
  .post(
    validator(JOI_USER_LOGIN_SCHEMA, ValidationSource.BODY),
    AuthController.loginLimiter,
    AuthController.login
  );

router
  .route('/register')
  .post(
    validator(JOI_USER_REGISTER_SCHEMA, ValidationSource.BODY),
    AuthController.register
  );

router
  .route('/forgotPassword')
  .post(
    validator(JOI_EMAIL_SCHEMA, ValidationSource.BODY),
    AuthController.forgotPasswordLimiter,
    AuthController.forgotPassword,
    EmailController.resetPassword
  );

router
  .route('/resetPassword/:token')
  .patch(
    validator(JOI_TOKEN_SCHEMA, ValidationSource.PARAM),
    validator(JOI_EMAIL_SCHEMA, ValidationSource.QUERY),
    validator(JOI_USER_RESET_PASSWORD_SCHEMA, ValidationSource.BODY),
    AuthController.resetPassword,
    EmailController.passwordUpdateSuccessfully
  );

router.route('/logout').post(AuthController.logout);

router
  .route('/refresh')
  .post(
    validator(JOI_AUTHORIZATION_SCHEMA, ValidationSource.HEADER),
    AuthController.isAuthorized,
    AuthController.refreshToken
  );

export default router;
