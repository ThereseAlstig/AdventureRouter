import pool from '../config/db'; // Din databasanslutning
import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { title } from 'process';


// Hjälpfunktion för att hämta eller skapa en stad
const getOrCreateCity = async (cityName: string): Promise<number> => {
  // Kontrollera om staden redan finns
  const [existingCityRows] = await pool.query(
      'SELECT id FROM Cities WHERE name = ? LIMIT 1',
      [cityName]
  );

  const existingCity = (existingCityRows as any[])[0];

  if (existingCity) {
      return existingCity.id; // Om staden finns, returnera dess ID
  }

  // Skapa staden om den inte finns
  const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO Cities (name) VALUES (?)',
      [cityName]
  );

  return result.insertId; // Returnera det genererade ID:t
};

// Uppdaterad `createTrip`-funktion
export const CreateTrip = async (req: Request, res: Response) => {
  const { startDate, endDate, travelMode, startCity, endCity, stops, startWeather, endWeather, userEmail } = req.body;

  try {
      // Hämta eller skapa startstad och slutstad
      const startCityId = await getOrCreateCity(startCity);
      const endCityId = await getOrCreateCity(endCity);
    
      let startWeatherId: number | null = null;
      let endWeatherId: number | null = null;

      // Skapa väder för startpunkten (om angivet)
      if (startWeather) {
          const [startResult] = await pool.query<ResultSetHeader>(
              'INSERT INTO WeatherConditions (temperature, wind_speed, description) VALUES (?, ?, ?)',
              [startWeather.temperature, startWeather.windSpeed, startWeather.description]
          );
          startWeatherId = startResult.insertId;
      }

      // Skapa väder för slutpunkten (om angivet)
      if (endWeather) {
          const [endResult] = await pool.query<ResultSetHeader>(
              'INSERT INTO WeatherConditions (temperature, wind_speed, description) VALUES (?, ?, ?)',
              [endWeather.temperature, endWeather.windSpeed, endWeather.description]
          );
          endWeatherId = endResult.insertId;
      }

      // Skapa resan

      const [tripResult] = await pool.query<ResultSetHeader>(
        'INSERT INTO Trips (title, start_date, end_date, travel_mode, start_city_id, end_city_id, start_weather_condition_id, end_weather_condition_id, user_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [   
            title,
            startDate || null, // Om `startDate` är tom eller undefined, sätt till `null`
            endDate || null,   // Samma här för `endDate`
            travelMode,
            startCityId,
            endCityId,
            startWeatherId || null, // Om väderdata inte finns, sätt till `null`
            endWeatherId || null,   // Samma här
            userEmail,
          ]
        );

      const tripId = tripResult.insertId;

      // Lägg till mellanstop
      if (stops && stops.length > 0) {
          for (const stop of stops) {
              const stopCityId = await getOrCreateCity(stop.cityName);

              let weatherConditionId: number | null = null;
              if (stop.weather) {
                  const [weatherResult] = await pool.query<ResultSetHeader>(
                      'INSERT INTO WeatherConditions (temperature, wind_speed, description) VALUES (?, ?, ?)',
                      [ stop.weather.temperature, stop.weather.windSpeed, stop.weather.description]
                  );
                  weatherConditionId = weatherResult.insertId;
              }

              await pool.query(
                  'INSERT INTO TripStops (trip_id, city_id, stop_order, weather_condition_id) VALUES (?, ?, ?, ?)',
                  [tripId, stopCityId, stop.order, weatherConditionId]
              );
          }
      }

      res.status(201).json({ message: 'Trip created successfully', tripId });
  } catch (error) {
      console.error('Error creating trip:', error);
      res.status(500).json({ message: 'Failed to create trip' });
  }
};

const groupTripsWithStops = (rows: any[][]) => {
    const trips: { [key: number]: any } = {};

    const flatRows = Array.isArray(rows[0]) ? rows[0] : rows;
    flatRows.forEach((row: any, index) => {
      
        if (!trips[row.trip_id]) {
            // Skapa ett nytt trip-objekt om det inte redan existerar
            trips[row.trip_id] = {
                trip_id: row.trip_id,
                title: row.title,
                start_date: row.start_date,
                end_date: row.end_date,
                travel_mode: row.travel_mode,
                best_experience: row.best_experience,
                worst_experience: row.worst_experience,
                start_city: row.start_city,
                end_city: row.end_city,
                start_weather: {
                    temperature: row.start_temperature,
                    wind_speed: row.start_wind_speed,
                    description: row.start_description,
                },
                end_weather: {
                    temperature: row.end_temperature,
                    wind_speed: row.end_wind_speed,
                    description: row.end_description,
                },
                user_email: row.user_email,
                user_username: row.user_username,
                stops: [], // Skapa en tom lista för stoppen
            };
        }

        // Lägg till stopp om det existerar
        if (row.stop_city_name) {
            trips[row.trip_id].stops.push({
                city_name: row.stop_city_name,
                stop_order: row.stop_order,
            });
        }
    });

    // Returnera en array av resor
    return Object.values(trips);
};

export const getTripWithDetails = async (req: Request, res: Response) => {
    try {
        const [rows]  = await pool.query(
            `SELECT 
                t.id AS trip_id,
                t.title,
                t.start_date,
                t.end_date,
                t.travel_mode,
                t.best_experience,
                t.worst_experience,
                sc.name AS start_city,
                ec.name AS end_city,
                swc.temperature AS start_temperature,
                swc.wind_speed AS start_wind_speed,
                swc.description AS start_description,
                ewc.temperature AS end_temperature,
                ewc.wind_speed AS end_wind_speed,
                ewc.description AS end_description,
                t.user_email,
                u.username AS user_username,
                c.name AS stop_city_name,
                ts.stop_order AS stop_order
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
                users u ON t.user_email = u.email
            LEFT JOIN 
                TripStops ts ON t.id = ts.trip_id       
            LEFT JOIN 
                Cities c ON ts.city_id = c.id
            ORDER BY 
                t.id, ts.stop_order;`
        );
       // rows är första elementet i tuple
        const trips = groupTripsWithStops(rows as any[][]); 
return trips;
        } catch (error) {
            console.error('Error fetching trip details:', error);
            res.status(500).json({ message: 'Failed to fetch trip details' });
        }
    };


  
export const uploadImage = async (req: Request, res: Response) => {
    const { tripId } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const mimeType = file.mimetype; // Exempel: 'image/jpeg'
        const imageSize = file.size; // Storlek i byte
        const imageData = file.buffer; // Binära data för bilden

        // Spara bilddata i databasen
        await pool.query(
            'INSERT INTO TripImages (trip_id, image, image_size, image_type) VALUES (?, ?, ?, ?)',
            [tripId, imageData, imageSize, mimeType]
        );

        res.status(201).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
};

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

