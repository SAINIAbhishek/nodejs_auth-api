import express from 'express';
import AuthController from '../../controllers/auth-controller';
import validatorHandler, {
  joiAuthorizationSchema,
  joiEmailSchema,
  joiTokenSchema,
  ValidationSource,
} from '../../middleware/validator-handler';
import EmailController from '../../controllers/email-controller';
import {
  joiUserLoginSchema,
  joiUserRegisterSchema,
  joiUserResetPasswordSchema,
} from '../../models/user-model';
import RateLimiterService from '../../services/rate-limiter-service';

const router = express.Router();

router
  .route('/login')
  .post(
    validatorHandler(joiUserLoginSchema, ValidationSource.BODY),
    RateLimiterService.loginLimiter,
    AuthController.login
  );

router
  .route('/register')
  .post(validatorHandler(joiUserRegisterSchema, ValidationSource.BODY), AuthController.register);

router
  .route('/forgotPassword')
  .post(
    validatorHandler(joiEmailSchema, ValidationSource.BODY),
    RateLimiterService.forgotPasswordLimiter,
    AuthController.forgotPassword,
    EmailController.resetPassword
  );

router
  .route('/resetPassword/:token')
  .patch(
    validatorHandler(joiTokenSchema, ValidationSource.PARAM),
    validatorHandler(joiUserResetPasswordSchema, ValidationSource.BODY),
    AuthController.resetPassword,
    EmailController.passwordUpdateSuccessfully
  );

router
  .route('/refresh')
  .post(
    validatorHandler(joiAuthorizationSchema, ValidationSource.HEADER),
    AuthController.isAuthorized,
    AuthController.refreshToken
  );

router.route('/logout').post(AuthController.logout);

export default router;
