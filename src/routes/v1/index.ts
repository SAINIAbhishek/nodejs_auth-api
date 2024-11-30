import express from 'express';
import HealthRoutes from './health-routes';
import AuthRoutes from './auth-routes';
import UserRoutes from './user-routes';

const router = express.Router();

router.use('/healthcheck', HealthRoutes);
router.use('/oauth', AuthRoutes);
router.use('/users', UserRoutes);

export default router;
