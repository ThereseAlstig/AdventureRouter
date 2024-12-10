import { Request, Response } from 'express';
import pool from '../config/db'; // Din databasanslutning
import { CreateTrip as createTripService, getTripWithDetails } from '../services/travelService';

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
