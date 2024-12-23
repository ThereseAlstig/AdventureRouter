import express from 'express';
import {  createTrip, getImageForTrip, getSingleTripById, getUserTripsWithDetails, getWeatherProducts, trips, updateTripWithDetails, uploadImageController } from '../controllers/travelConbtrollers';
import { ensureAuthenticated } from '../middleware/authMiddleware';


const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Route för att hämta produkter baserat på väderförhållande
router.get('/weather-products', getWeatherProducts);
router.post('/travel-journey',ensureAuthenticated, createTrip);
router.get('/travels', trips);
router.get('/travels/:email', ensureAuthenticated, getUserTripsWithDetails);
router.post("/trips/:tripId",  ensureAuthenticated, updateTripWithDetails, (req, res) => {  
    res.send("Trip updated");
});
router.post("/trips/:tripId/image", upload.single("image"), uploadImageController);
router.get("/trips/:tripId/image", getImageForTrip);
router.get("/trip/:id", getSingleTripById);


export default router;
