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
exports.trips = exports.createTrip = exports.getWeatherProducts = void 0;
const db_1 = __importDefault(require("../config/db")); // Din databasanslutning
const travelService_1 = require("../services/travelService");
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
