import { Request, Response } from 'express';
import pool from '../config/db'; // Din databasanslutning
import { CreateTrip as createTripService, getTripWithDetails } from '../services/travelService';
import { saveImage } from "../services/travelService";
import multer from "multer";
// Controller: Hämta produkter baserat på väderförhållande
export const getWeatherProducts = async (req: Request, res: Response): Promise<void> => {
  const { weatherCondition } = req.query;

  if (!weatherCondition) {
    res.status(400).json({ message: 'Weather condition is required' });
    return
  }

  try {
    const query = `
      SELECT p.*
      FROM Products p
      LEFT JOIN ProductWeather pw ON p.id = pw.product_id
      LEFT JOIN WeatherConditions wc ON pw.weather_id = wc.id
      WHERE wc.name = ?;
    `;
    const [rows] = await pool.query(query, [weatherCondition]);

    res.status(200).json({ weatherCondition, products: rows });
  } catch (error) {
    console.error('Error in getWeatherProducts:', error);
    res.status(500).json({ message: 'Failed to fetch products for weather condition.' });
  }
};



export const createTrip = async (req: Request, res: Response) => {
    try {
        const result = await createTripService(req, res);
        res.status(201).json(result); // Skicka tillbaka framgångsmeddelande och tripId
    } catch (error) {
        console.error('Error in createTrip controller:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Failed to create trip', error: errorMessage });
    }
};
export const trips = async (req: Request, res: Response) => {
    try {
        const trips = await getTripWithDetails(req, res);
        res.status(201).json(trips); // Skicka tillbaka framgångsmeddelande och tripId
    } catch (error) {
        console.error('Error in createTrip controller:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Failed to create trip', error: errorMessage });
    }
};

export const getUserTripsWithDetails = async (req: Request, res: Response) => {
  try {
      const userEmail = req.params.email; // Hämta e-post från URL-parameter

      // Återanvänd befintlig service
      const allTrips = await getTripWithDetails(req, res);

      // Filtrera resorna baserat på e-post
      const userTrips = allTrips ? allTrips.filter((trip: any) => trip.user_email === userEmail) : [];

      res.status(200).json(userTrips); // Returnera filtrerade resor
  } catch (error) {
      console.error('Error fetching user trips:', error);
      res.status(500).json({ message: 'Failed to fetch user trips' });
  }
};

// uppdaatera resa med bild och wors best

export const updateTripWithDetails = async (req: Request, res: Response) => {
  const { tripId } = req.params; // Hämta resans ID från URL
  const { worst_experience, best_experience } = req.body; // Hämta upplevelser från body
  
  try {
      // Starta en transaktion
     const connection = await pool.getConnection() 
      try{
          await connection.beginTransaction();

          // Uppdatera worst_experience och best_experience
          await connection.query(
              `UPDATE Trips 
               SET worst_experience = ?, best_experience = ? 
               WHERE id = ?`,
              [worst_experience, best_experience, tripId]
          );

         

          await connection.commit();
          res.status(200).json({ message: 'Trip updated successfully' });
        } catch (error) {
          await connection.rollback();
          res.status(500).json({ message: 'Failed to update trip', error });
        } finally {
          connection.release();
        }
      } catch (error) {
        res.status(500).json({ message: 'Failed to get database connection', error });
      }
};

const upload = multer({ storage: multer.memoryStorage() }); // Lagra filen i minnet

export const uploadImageController = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params; // Hämta tripId från URL
        const file = req.file; // Filen som laddades upp av användaren

        if (!tripId || isNaN(Number(tripId))) {
           res.status(400).json({ message: "Invalid trip ID" }); 
           return 
        }

        if (!file) {
           res.status(400).json({ message: "No file uploaded" }); 
           return 
        }

        await saveImage(Number(tripId), file);

        res.status(200).json({ message: "Image uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Failed to upload image" });
    }
};

export const getImageForTrip = async (req: Request, res: Response): Promise<void> => {
  try {
      const { tripId } = req.params;

      if (!tripId || isNaN(Number(tripId))) {
          res.status(400).json({ message: "Invalid trip ID" });
          return;
      }

      // Hämta bilden från databasen
      const [rows]: any = await pool.query(
          `SELECT image, image_type FROM TripImages WHERE trip_id = ? LIMIT 1`,
          [Number(tripId)]
      );

      if (rows.length === 0) {
        console.log(`No image found for trip ${tripId}`);
        res.status(200).json({ message: "No image found" });
        return;
      }

      const { image, image_type } = rows[0];

      // Skicka bilden som svar
      res.set("Content-Type", image_type);
      res.send(image);
  } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: "Failed to fetch image" });
  }
};