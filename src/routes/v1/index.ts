import express from 'express';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';

const router = express.Router();

router.use('/oauth', AuthRoutes);
router.use('/users', UserRoutes);

export default router;
