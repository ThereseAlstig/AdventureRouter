"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const travelConbtrollers_1 = require("../controllers/travelConbtrollers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Route för att hämta produkter baserat på väderförhållande
router.get('/weather-products', travelConbtrollers_1.getWeatherProducts);
router.post('/travel-journey', authMiddleware_1.ensureAuthenticated, travelConbtrollers_1.createTrip);
router.get('/travels', travelConbtrollers_1.trips);
exports.default = router;
