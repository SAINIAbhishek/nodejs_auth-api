import express from 'express';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';
import HealthRoutes from './HealthRoutes';

const router = express.Router();

router.use('/healthcheck', HealthRoutes);

router.use('/oauth', AuthRoutes);
router.use('/users', UserRoutes);

export default router;
