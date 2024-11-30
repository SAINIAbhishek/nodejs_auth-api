import express from 'express';
import validatorHandler, {
  joiAuthorizationSchema,
  joiIdSchema,
  ValidationSource,
} from '../../middleware/validator-handler';
import AuthController from '../../controllers/auth-controller';
import { joiUserCreateSchema, joiUserUpdateSchema } from '../../models/user-model';
import UserController from '../../controllers/user-controller';

const router = express.Router();

router.use(
  validatorHandler(joiAuthorizationSchema, ValidationSource.HEADER),
  AuthController.isAuthorized
);

router
  .route('/')
  .post(validatorHandler(joiUserCreateSchema, ValidationSource.BODY), UserController.createNewUser)
  .get(UserController.getAllUsers);

router.use('/:id', validatorHandler(joiIdSchema, ValidationSource.PARAM));

router
  .route('/:id')
  .get(UserController.getUser)
  .put(validatorHandler(joiUserUpdateSchema, ValidationSource.BODY), UserController.updateUser)
  .delete(UserController.deleteUser);

export default router;
