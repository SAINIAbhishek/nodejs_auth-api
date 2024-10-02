import express from 'express';
import HealthCheckController from '../../controllers/HealthCheckController';

const router = express.Router();

router
  .route('/')
  .get(
    HealthCheckController.checkHealth
  );

export default router;