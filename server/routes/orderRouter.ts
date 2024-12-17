import express from 'express';
import { ensureAuthenticated } from '../middleware/authMiddleware';
import { clearCartByEmailController, CreateCart, createOrder, fetchCart, transferAnonymousCartController } from '../controllers/orderController';

const router = express.Router();

router.post('/createOrders', (req, res, next) => {
    next();
  }, ensureAuthenticated, createOrder);
  router.post('/createCart', (req, res, next) => {
  next();
  }, CreateCart);
  router.get('/fetchCart', fetchCart);
  router.post('/clearCartByEmail', ensureAuthenticated, clearCartByEmailController());
  router.post('/transferAnonymousCart', transferAnonymousCartController);

export default router;