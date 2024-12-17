import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController';
import { ensureAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();


router.post('/create-payment-intent', (req, res, next) => {
    next();
},ensureAuthenticated, createPaymentIntent);

export default router;