import { Request, Response } from 'express';
import pool from '../config/db'; // Din databasanslutning

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
