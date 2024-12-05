import { Request, Response } from 'express';
import * as productService from '../services/productService';
import pool from '../config/db';
import { createProduct } from '../services/productService';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

export const getFilteredProducts = async (req: Request, res: Response) => {
try {
    const filters = {
        categoryOne: req.query.categoryOne ? String(req.query.categoryOne) : null,
        categoryTwo: req.query.categoryTwo ? String(req.query.categoryTwo) : null,
        weather: req.query.weather ? String(req.query.weather) : null,
        temperature: req.query.temperature ? String(req.query.temperature) : null,
        travelOptionId: req.query.travelOptionId ? Number(req.query.travelOptionId) : null,
      };

    const products = await productService.getFilteredProductsBY(filters);
    console.log('Filtered products fetchedjljlkjlkjl:', products);
    res.status(200).json(products);
} catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
}

}

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await productService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
}

export const addProduct = async (req: Request, res: Response) => {
console.log('addProduct');
    const productData = req.body;  // Hämta produktdata från POST-begäran

    try {
        // Anropa servicefunktionen för att skapa produkten
        const result = await createProduct(productData);
        res.status(201).json(result);  // Skicka tillbaka resultatet från databasen
    } catch (error) {
        res.status(500).json({ message: 'Failed to add product.' });
    }
  
};

// Hämta alla resealternativ
export const getAllTravelOptions = async (req: Request, res: Response) => {
    try {
      const [travelOptions] = await pool.query('SELECT id, name FROM TravelOptions');
      res.json(travelOptions);
    } catch (error) {
        console.error('Error fetching travel options:', error);
        res.status(500).json({ message: 'Failed to fetch travel options' });
    }
  };
  
  export const getAllCategoriesTwo = async (req: Request, res: Response) => {
    try {
      const [categories] = await pool.query('SELECT id, name FROM CategoryTwo');
      res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
  };

  export const getAllWeatherTemperatures = async (req: Request, res: Response) => {
    try {
      const [weatherTemperatures] = await pool.query('SELECT id, name FROM WeatherTemperature');
      res.json(weatherTemperatures);
    } catch (error) {
        console.error('Error fetching weather temperatures:', error);
        res.status(500).json({ message: 'Failed to fetch weather temperatures' });
    }
  };

  export const getAllWeatherOptions = async (req: Request, res: Response) => {
    try {
      const [weatherOptions] = await pool.query('SELECT id, name FROM Weather');
      res.json(weatherOptions);
    } catch (error) {
     console.error('Error fetching weather options:', error);
    }
  };
