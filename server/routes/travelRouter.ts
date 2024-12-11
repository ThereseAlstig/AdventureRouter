import express from 'express';
import {  createTrip, getUserTripsWithDetails, getWeatherProducts, trips } from '../controllers/travelConbtrollers';
import { ensureAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// Route för att hämta produkter baserat på väderförhållande
router.get('/weather-products', getWeatherProducts);
router.post('/travel-journey',ensureAuthenticated, createTrip);
router.get('/travels', trips);
router.get('/travels/:email', ensureAuthenticated, getUserTripsWithDetails);

export default router;
