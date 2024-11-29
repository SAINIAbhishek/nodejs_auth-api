import express from 'express';
import HealthRoutes from './health-routes';

const router = express.Router();

router.use('/healthcheck', HealthRoutes);

export default router;
