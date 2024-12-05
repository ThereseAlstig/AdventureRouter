import express from 'express';
import {  getWeatherProducts } from '../controllers/travelConbtrollers';

const router = express.Router();

// Route för att hämta produkter baserat på väderförhållande
router.get('/weather-products', getWeatherProducts);


export default router;
