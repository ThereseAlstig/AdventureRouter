import express from 'express';
import { ensureAuthenticated } from '../middleware/authMiddleware';
import { createOrder } from '../controllers/orderController';

const router = express.Router();

router.post('/createOrders', (req, res, next) => {
    next();
  }, ensureAuthenticated, createOrder);

export default router;