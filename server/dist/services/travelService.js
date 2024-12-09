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
exports.getTripWithDetails = exports.CreateTrip = void 0;
const db_1 = __importDefault(require("../config/db")); // Din databasanslutning
// Hjälpfunktion för att hämta eller skapa en stad
const getOrCreateCity = (cityName) => __awaiter(void 0, void 0, void 0, function* () {
    // Kontrollera om staden redan finns
    const [existingCityRows] = yield db_1.default.query('SELECT id FROM Cities WHERE name = ? LIMIT 1', [cityName]);
    const existingCity = existingCityRows[0];
    if (existingCity) {
        return existingCity.id; // Om staden finns, returnera dess ID
    }
    // Skapa staden om den inte finns
    const [result] = yield db_1.default.query('INSERT INTO Cities (name) VALUES (?)', [cityName]);
    return result.insertId; // Returnera det genererade ID:t
});
// Uppdaterad `createTrip`-funktion
const CreateTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, travelMode, startCity, endCity, stops, startWeather, endWeather, userEmail } = req.body;
    try {
        // Hämta eller skapa startstad och slutstad
        const startCityId = yield getOrCreateCity(startCity);
        const endCityId = yield getOrCreateCity(endCity);
        let startWeatherId = null;
        let endWeatherId = null;
        // Skapa väder för startpunkten (om angivet)
        if (startWeather) {
            const [startResult] = yield db_1.default.query('INSERT INTO WeatherConditions (weather_type, temperature, wind_speed, description) VALUES (?, ?, ?, ?)', [startWeather.weatherType, startWeather.temperature, startWeather.windSpeed, startWeather.description]);
            startWeatherId = startResult.insertId;
        }
        // Skapa väder för slutpunkten (om angivet)
        if (endWeather) {
            const [endResult] = yield db_1.default.query('INSERT INTO WeatherConditions (weather_type, temperature, wind_speed, description) VALUES (?, ?, ?, ?)', [endWeather.weatherType, endWeather.temperature, endWeather.windSpeed, endWeather.description]);
            endWeatherId = endResult.insertId;
        }
        // Skapa resan
        const [tripResult] = yield db_1.default.query('INSERT INTO Trips (start_date, end_date, travel_mode, start_city_id, end_city_id, start_weather_condition_id, end_weather_condition_id, user_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [startDate, endDate, travelMode, startCityId, endCityId, startWeatherId, endWeatherId, userEmail]);
        const tripId = tripResult.insertId;
        // Lägg till mellanstop
        if (stops && stops.length > 0) {
            for (const stop of stops) {
                const stopCityId = yield getOrCreateCity(stop.cityName);
                let weatherConditionId = null;
                if (stop.weather) {
                    const [weatherResult] = yield db_1.default.query('INSERT INTO WeatherConditions (weather_type, temperature, wind_speed, description) VALUES (?, ?, ?, ?)', [stop.weather.weatherType, stop.weather.temperature, stop.weather.windSpeed, stop.weather.description]);
                    weatherConditionId = weatherResult.insertId;
                }
                yield db_1.default.query('INSERT INTO TripStops (trip_id, city_id, stop_order, weather_condition_id) VALUES (?, ?, ?, ?)', [tripId, stopCityId, stop.order, weatherConditionId]);
            }
        }
        res.status(201).json({ message: 'Trip created successfully', tripId });
    }
    catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ message: 'Failed to create trip' });
    }
});
exports.CreateTrip = CreateTrip;
const getTripWithDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [trips] = yield db_1.default.query(`SELECT 
                t.id AS trip_id,
                t.start_date,
                t.end_date,
                t.travel_mode,
                sc.name AS start_city,
                ec.name AS end_city,
                swc.weather_type AS start_weather_type,
                swc.temperature AS start_temperature,
                swc.wind_speed AS start_wind_speed,
                swc.description AS start_description,
                ewc.weather_type AS end_weather_type,
                ewc.temperature AS end_temperature,
                ewc.wind_speed AS end_wind_speed,
                ewc.description AS end_description,
                t.user_email,
                u.username AS user_username
             FROM 
                Trips t
             LEFT JOIN 
                Cities sc ON t.start_city_id = sc.id
             LEFT JOIN 
                Cities ec ON t.end_city_id = ec.id
             LEFT JOIN 
                WeatherConditions swc ON t.start_weather_condition_id = swc.id
             LEFT JOIN 
                WeatherConditions ewc ON t.end_weather_condition_id = ewc.id
                LEFT JOIN 
    users u ON t.user_email = u.email;`);
        res.status(200).json(trips);
    }
    catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ message: 'Failed to fetch trips' });
    }
});
exports.getTripWithDetails = getTripWithDetails;
// export const uploadImage = async (req: Request, res: Response) => {
//     const { tripId } = req.body;
//     const file = req.file;
//     if (!file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//     }
//     try {
//         const mimeType = file.mimetype; // Exempel: 'image/jpeg'
//         const imageSize = file.size; // Storlek i byte
//         const imageData = file.buffer; // Binära data för bilden
//         // Spara bilddata i databasen
//         await pool.query(
//             'INSERT INTO TripImages (trip_id, image, image_size, image_type) VALUES (?, ?, ?, ?)',
//             [tripId, imageData, imageSize, mimeType]
//         );
//         res.status(201).json({ message: 'Image uploaded successfully' });
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         res.status(500).json({ message: 'Failed to upload image' });
//     }
// };
// export const getImage = async (req: Request, res: Response) => {
//   const { imageId } = req.params;
//   try {
//       const [rows] = await pool.query('SELECT image, image_type FROM TripImages WHERE id = ?', [imageId]);
//       if (rows.length === 0) {
//           return res.status(404).json({ message: 'Image not found' });
//       }
//       const { image, image_type } = rows[0];
//       res.setHeader('Content-Type', image_type);
//       res.send(image); // Skicka binär data till klienten
//   } catch (error) {
//       console.error('Error fetching image:', error);
//       res.status(500).json({ message: 'Failed to fetch image' });
//   }
// };
