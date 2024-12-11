"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageForTrip = exports.uploadImageController = exports.updateTripWithDetails = exports.getUserTripsWithDetails = exports.trips = exports.createTrip = exports.getWeatherProducts = void 0;
const db_1 = __importDefault(require("../config/db")); // Din databasanslutning
const travelService_1 = require("../services/travelService");
const travelService_2 = require("../services/travelService");
const multer_1 = __importDefault(require("multer"));
// Controller: Hämta produkter baserat på väderförhållande
const getWeatherProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { weatherCondition } = req.query;
    if (!weatherCondition) {
        res.status(400).json({ message: 'Weather condition is required' });
        return;
    }
    try {
        const query = `
      SELECT p.*
      FROM Products p
      LEFT JOIN ProductWeather pw ON p.id = pw.product_id
      LEFT JOIN WeatherConditions wc ON pw.weather_id = wc.id
      WHERE wc.name = ?;
    `;
        const [rows] = yield db_1.default.query(query, [weatherCondition]);
        res.status(200).json({ weatherCondition, products: rows });
    }
    catch (error) {
        console.error('Error in getWeatherProducts:', error);
        res.status(500).json({ message: 'Failed to fetch products for weather condition.' });
    }
});
exports.getWeatherProducts = getWeatherProducts;
const createTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, travelService_1.CreateTrip)(req, res);
        res.status(201).json(result); // Skicka tillbaka framgångsmeddelande och tripId
    }
    catch (error) {
        console.error('Error in createTrip controller:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Failed to create trip', error: errorMessage });
    }
});
exports.createTrip = createTrip;
const trips = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trips = yield (0, travelService_1.getTripWithDetails)(req, res);
        res.status(201).json(trips); // Skicka tillbaka framgångsmeddelande och tripId
    }
    catch (error) {
        console.error('Error in createTrip controller:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Failed to create trip', error: errorMessage });
    }
});
exports.trips = trips;
const getUserTripsWithDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.params.email; // Hämta e-post från URL-parameter
        // Återanvänd befintlig service
        const allTrips = yield (0, travelService_1.getTripWithDetails)(req, res);
        // Filtrera resorna baserat på e-post
        const userTrips = allTrips ? allTrips.filter((trip) => trip.user_email === userEmail) : [];
        res.status(200).json(userTrips); // Returnera filtrerade resor
    }
    catch (error) {
        console.error('Error fetching user trips:', error);
        res.status(500).json({ message: 'Failed to fetch user trips' });
    }
});
exports.getUserTripsWithDetails = getUserTripsWithDetails;
// uppdaatera resa med bild och wors best
const updateTripWithDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tripId } = req.params; // Hämta resans ID från URL
    const { worst_experience, best_experience } = req.body; // Hämta upplevelser från body
    try {
        // Starta en transaktion
        const connection = yield db_1.default.getConnection();
        try {
            yield connection.beginTransaction();
            // Uppdatera worst_experience och best_experience
            yield connection.query(`UPDATE Trips 
               SET worst_experience = ?, best_experience = ? 
               WHERE id = ?`, [worst_experience, best_experience, tripId]);
            yield connection.commit();
            res.status(200).json({ message: 'Trip updated successfully' });
        }
        catch (error) {
            yield connection.rollback();
            res.status(500).json({ message: 'Failed to update trip', error });
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get database connection', error });
    }
});
exports.updateTripWithDetails = updateTripWithDetails;
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }); // Lagra filen i minnet
const uploadImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tripId } = req.params; // Hämta tripId från URL
        const file = req.file; // Filen som laddades upp av användaren
        if (!tripId || isNaN(Number(tripId))) {
            res.status(400).json({ message: "Invalid trip ID" });
            return;
        }
        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        yield (0, travelService_2.saveImage)(Number(tripId), file);
        res.status(200).json({ message: "Image uploaded successfully!" });
    }
    catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Failed to upload image" });
    }
});
exports.uploadImageController = uploadImageController;
const getImageForTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tripId } = req.params;
        if (!tripId || isNaN(Number(tripId))) {
            res.status(400).json({ message: "Invalid trip ID" });
            return;
        }
        // Hämta bilden från databasen
        const [rows] = yield db_1.default.query(`SELECT image, image_type FROM TripImages WHERE trip_id = ? LIMIT 1`, [Number(tripId)]);
        if (rows.length === 0) {
            console.log(`No image found for trip ${tripId}`);
            res.status(200).json({ message: "No image found" });
            return;
        }
        const { image, image_type } = rows[0];
        // Skicka bilden som svar
        res.set("Content-Type", image_type);
        res.send(image);
    }
    catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).json({ message: "Failed to fetch image" });
    }
});
exports.getImageForTrip = getImageForTrip;
