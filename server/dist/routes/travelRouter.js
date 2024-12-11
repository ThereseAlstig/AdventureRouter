"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const travelConbtrollers_1 = require("../controllers/travelConbtrollers");
const authMiddleware_1 = require("../middleware/authMiddleware");
// import upload from '../middleware/multer';
const router = express_1.default.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// Route för att hämta produkter baserat på väderförhållande
router.get('/weather-products', travelConbtrollers_1.getWeatherProducts);
router.post('/travel-journey', authMiddleware_1.ensureAuthenticated, travelConbtrollers_1.createTrip);
router.get('/travels', travelConbtrollers_1.trips);
router.get('/travels/:email', authMiddleware_1.ensureAuthenticated, travelConbtrollers_1.getUserTripsWithDetails);
router.post("/trips/:tripId", authMiddleware_1.ensureAuthenticated, travelConbtrollers_1.updateTripWithDetails, (req, res) => {
    res.send("Trip updated");
});
router.post("/trips/:tripId/image", upload.single("image"), travelConbtrollers_1.uploadImageController);
router.get("/trips/:tripId/image", travelConbtrollers_1.getImageForTrip);
exports.default = router;
