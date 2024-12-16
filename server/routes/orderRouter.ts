import express from 'express';
import { ensureAuthenticated } from '../middleware/authMiddleware';
import { CreateCart, createOrder, fetchCart } from '../controllers/orderController';

const router = express.Router();

router.post('/createOrders', (req, res, next) => {
    next();
  }, ensureAuthenticated, createOrder);
  router.post('/createCart', (req, res, next) => {
  next();
  }, CreateCart);
  router.get('/fetchCart', fetchCart);

export default router;