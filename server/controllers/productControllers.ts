import { Request, Response } from 'express';
import * as productService from '../services/productService';
import pool from '../config/db';
import { createProduct, getCategoryOneIdByName, getCategoryTwoIdByName, getProductsByName, updateProductInStock } from '../services/productService';
import { parse } from 'path';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

//Hämta produkter baserat på ID
export const getProductById = async (req: Request, res: Response) => {
 
  const { id } = req.params; // Hämta ID från request-parametrarna
  try {
      const product = await productService.getProductById(Number(id)); 
      if (!product) {
          res.status(404).json({ message: 'Product not found' });
          return 
      }
      res.status(200).json(product);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch product' });
  }
};

//hämta produkter baserat på namn
export const searchProducts = async (req: Request, res: Response) => {

  const { name } = req.query; // Hämta sökparametern från förfrågan
console.log('name:', name);
  if (!name) {
     res.status(400).json({ error: 'Name is missing' }); 
     return 
  }

  try {

      const products = await getProductsByName(name as string); // Anropa service-funktionen
      res.status(200).json(products);
  } catch (error) {
      console.error('Error in searchProducts:', error);
      res.status(500).json({ error: 'Something whent wrong during fetch' });
  }
};

//Hämta filtrerade produkter baserat på väder, temperatur, kategori och resealternativ

export const getFilteredProducts = async (req: Request, res: Response) => {
try {
    const filters = {
        categoryOne: req.query.categoryOne ? String(req.query.categoryOne) : null,
        categoryTwo: req.query.categoryTwo ? String(req.query.categoryTwo) : null,
        weather: req.query.weather ? String(req.query.weather) : null,
        temperature: req.query.temperature ? String(req.query.temperature) : null,
        travelOption: req.query.travelOption ? String(req.query.travelOption) : null,
      };

    const products = await productService.getFilteredProductsBY(filters);
    
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

// Skapa en ny produkt
export const addProduct = async (req: Request, res: Response) => {

    const productData = req.body;  

    try {
        // Anropa servicefunktionen för att skapa produkten
        const result = await createProduct(productData);
        res.status(201).json(result);  
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
  
  //hämta categorierna
  export const getAllCategoriesTwo = async (req: Request, res: Response) => {
    try {
      const [categories] = await pool.query('SELECT id, name FROM CategoryTwo');
      res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
  };

  //Hämta temperaturspann
  export const getAllWeatherTemperatures = async (req: Request, res: Response) => {
    try {
      const [weatherTemperatures] = await pool.query('SELECT id, name FROM WeatherTemperature');
      res.json(weatherTemperatures);
    } catch (error) {
        console.error('Error fetching weather temperatures:', error);
        res.status(500).json({ message: 'Failed to fetch weather temperatures' });
    }
  };

  //Hämta väder
  export const getAllWeatherOptions = async (req: Request, res: Response) => {
    try {
      const [weatherOptions] = await pool.query('SELECT id, name FROM Weather');
      res.json(weatherOptions);
    } catch (error) {
     console.error('Error fetching weather options:', error);
    }
  };

//hämta väder id
  export const getCategoriesId = async (req: Request, res: Response) => {
   

    const { categoryOne, categoryTwo } = req.body;

    if (!categoryOne || !categoryTwo) {
        res.status(400).json({ message: 'Both categoryOne and categoryTwo are required' });
    return
   }
  try {
    const categoryOneId = await getCategoryOneIdByName(categoryOne as string);
    const categoryTwoId = await getCategoryTwoIdByName(categoryTwo as string);
    res.status(200).json({
      categoryOneId,
      categoryTwoId,
  });
} catch (error) {
  console.error('Error fetching category IDs:', error);
  res.status(500).json({ message: 'Failed to fetch category IDs' });
}
};
  
//Ändra om produkten finns att beställa eller inte 

export const toggleInStock = async (req: Request, res: Response) => {

  const { in_stock, productId } = req.body;
  const parsedInStock = in_stock === 'true' ? true : in_stock === 'false' ? false : in_stock;
  // Kolla om in_stock är en boolean

  if (typeof in_stock !== 'boolean') {
    res.status(400).json({ message: '`in_stock` must be a boolean value (true or false).' });
  return;
  }

  try {
    const result = await updateProductInStock(productId, parsedInStock);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in toggleInStock controller:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};
