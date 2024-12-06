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
exports.getAllCategories = exports.createProduct = exports.getFilteredProductsBY = exports.getAllProducts = void 0;
const db_1 = __importDefault(require("../config/db"));
//getting all products
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        SELECT 
            p.id AS id,
            p.name AS name,
            p.price,
            p.description,
            p.image_url,
            p.in_stock,
            p.travel_option_id,

                c1.name AS category_one_name,
                c2.name AS category_two_name,
                w.name AS weather_name,
                wt.name AS weather_temperature_name,
                t.name AS travel_option_name

        FROM 
            Products p

            
LEFT JOIN 
    CategoryProduct cp ON p.id = cp.product_id
LEFT JOIN 
    CategoryTwo c2 ON cp.category_id = c2.id AND c2.id IS NOT NULL
  LEFT JOIN 
     CategoryOne c1 ON cp.category_id = c1.id AND c1.id IS NOT NULL

      LEFT JOIN 
        ProductWeather pw ON p.id = pw.product_id
    LEFT JOIN 
        Weather w ON pw.weather_id = w.id
         LEFT JOIN 
        ProductWeatherTemperature pwt ON p.id = pwt.product_id
    LEFT JOIN 
        WeatherTemperature wt ON pwt.temperature_id = wt.id
        LEFT JOIN
        TravelOptions t on p.travel_option_id = t.id;
     `;
    try {
        const [rows] = yield db_1.default.query(query);
        console.log('Products fetched:', rows); // Logga resultatet för felsökning
        return rows;
    }
    catch (error) {
        console.error('Error fetching products:', error); // Logga eventuella fel
        throw error; // Släng felet så att det hanteras i någon annan del av koden
    }
});
exports.getAllProducts = getAllProducts;
const getFilteredProductsBY = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    // Grundläggande SQL-fråga
    let query = `
     SELECT 
        p.id AS id,
        p.name AS name,
        p.price,
        p.description,
        p.image_url,
        p.travel_option_id,
        t.name AS travel_option_name, 
        p.in_stock,
        c1.name AS category_one_name,
        c2.name AS category_two_name,
        w.name AS weather_name,
        wt.name AS weather_temperature_name
    FROM 
        Products p
    LEFT JOIN 
        TravelOptions t on p.travel_option_id = t.id
    LEFT JOIN 
        CategoryProduct cp ON p.id = cp.product_id
    LEFT JOIN 
        CategoryTwo c2 ON cp.category_id = c2.id
    LEFT JOIN 
        CategoryOne c1 ON c2.category_one_id = c1.id
    LEFT JOIN 
        ProductWeather pw ON p.id = pw.product_id
    LEFT JOIN 
        Weather w ON pw.weather_id = w.id
    LEFT JOIN 
        ProductWeatherTemperature pwt ON p.id = pwt.product_id
    LEFT JOIN 
        WeatherTemperature wt ON pwt.temperature_id = wt.id
   
    `;
    // Förbered WHERE-klausuler baserat på filtren
    let whereClauses = [];
    // Lägg till WHERE-villkor för de parametrar som finns
    if (filters.categoryOne) {
        whereClauses.push(`c1.id = ?`);
    }
    if (filters.categoryTwo) {
        whereClauses.push(`c2.id = ?`);
    }
    if (filters.weather) {
        whereClauses.push(`w.name = ?`);
    }
    if (filters.temperature) {
        whereClauses.push(`wt.name = ?`);
    }
    if (filters.travelOptionName) {
        whereClauses.push(`t.name = ?`);
    }
    // Om några filter är angivna, lägg till en WHERE-klasul
    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
    }
    try {
        const params = [];
        if (filters.categoryOne)
            params.push(filters.categoryOne);
        if (filters.categoryTwo)
            params.push(filters.categoryTwo);
        if (filters.weather)
            params.push(filters.weather);
        if (filters.temperature)
            params.push(filters.temperature);
        if (filters.travelOptionName)
            params.push(filters.travelOptionName);
        const [rows] = yield db_1.default.query(query, params);
        console.log('Filtered products fetched:', rows);
        return rows; // Returnera matchande produkter
    }
    catch (error) {
        console.error('Error in getFilteredProducts:', error);
        throw new Error('Failed to fetch filtered products.');
    }
});
exports.getFilteredProductsBY = getFilteredProductsBY;
//function to create a product
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield db_1.default.query('INSERT INTO Products (name, price, description, travel_option_id, image_url, in_stock) VALUES (?, ?, ?, ?, ?, ?)', [productData.name, productData.price, productData.description, productData.travel_option_id, productData.image_url, productData.in_stock]);
        if (productData.productCategories && productData.productCategories.length > 0) {
            const categoryValues = productData.productCategories.map((categoryId) => [result.insertId, categoryId]);
            yield db_1.default.query('INSERT INTO CategoryProduct (product_id, category_id) VALUES ?', [categoryValues]);
        }
        // Om det finns väder-ID:n, koppla dem till produkten
        if (productData.weather_temperature_id && productData.weather_temperature_id.length > 0) {
            const tempValues = productData.weather_temperature_id.map((tempId) => [result.insertId, tempId]);
            yield db_1.default.query('INSERT INTO ProductWeatherTemperature (product_id, temperature_id) VALUES ?', [tempValues]);
            console.log('Temperature conditions linked.');
        }
        if (productData.weather_ids && productData.weather_ids.length > 0) {
            console.log('Weather IDs provided:', productData.weather_ids);
            const weatherValues = productData.weather_ids.map((weatherId) => [result.insertId, weatherId]);
            console.log('Prepared values for ProductWeather:', weatherValues);
            try {
                const query = 'INSERT INTO ProductWeather (product_id, weather_id) VALUES ?';
                yield db_1.default.query(query, [weatherValues]);
                console.log('Weather conditions successfully linked to product.');
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error while linking weather conditions:', error.message);
                }
                else {
                    console.error('Error while linking weather conditions:', error);
                }
            }
        }
        else {
            console.log('No weather_ids provided or the array is empty.');
        }
        return { productData, productId: result.insertId, message: 'Product created and weather conditions linked.' };
    }
    catch (error) {
        console.error('Error during product creation:', error);
        if (error instanceof Error) {
            throw new Error('Failed to add product: ' + error.message); // Få mer specifik information om felet
        }
        else {
            throw new Error('Failed to add product: ' + String(error)); // Fallback for non-Error types
        }
    }
});
exports.createProduct = createProduct;
// Funktion för att hämta alla kategorier
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
         SELECT 
            c1.id AS category_one_id, 
            c1.name AS category_one_name, 
            c2.id AS category_two_id, 
            c2.name AS category_two_name
        FROM 
            CategoryOne c1
        LEFT JOIN 
            CategoryTwo c2 ON c1.id = c2.category_one_id
       
    `;
    try {
        // Kör SQL-frågan
        const [rows] = yield db_1.default.query(query);
        console.log('All categories and subcategories fetched:', rows); // Logga resultatet för felsökning
        // Strukturera resultatet så att underkategorier läggs under sina huvudkategorier
        const categories = rows.reduce((acc, row) => {
            const { category_one_id, category_one_name, category_two_id, category_two_name } = row;
            // Om huvudkategorin inte redan finns i ackumulatorn, lägg till den
            if (!acc[category_one_id]) {
                acc[category_one_id] = {
                    id: category_one_id,
                    name: category_one_name,
                    subcategories: []
                };
            }
            // Om det finns en underkategori, lägg till den under huvudkategorin
            if (category_two_id) {
                acc[category_one_id].subcategories.push({
                    id: category_two_id,
                    name: category_two_name
                });
            }
            return acc;
        }, {});
        // Konvertera objektet till en array
        const result = Object.values(categories);
        return result;
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        throw error; // Kasta vidare felet
    }
});
exports.getAllCategories = getAllCategories;
