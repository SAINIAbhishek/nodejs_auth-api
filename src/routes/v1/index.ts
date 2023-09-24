import express from 'express';
import AuthRoutes from './AuthRoutes';

const router = express.Router();

router.use('/oauth', AuthRoutes);

export default router;
