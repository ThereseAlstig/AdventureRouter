"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.toggleInStock = exports.getCategoriesId = exports.getAllWeatherOptions = exports.getAllWeatherTemperatures = exports.getAllCategoriesTwo = exports.getAllTravelOptions = exports.addProduct = exports.getCategories = exports.getFilteredProducts = exports.searchProducts = exports.getProductById = exports.getProducts = void 0;
const productService = __importStar(require("../services/productService"));
const db_1 = __importDefault(require("../config/db"));
const productService_1 = require("../services/productService");
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productService.getAllProducts();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});
exports.getProducts = getProducts;
//Hämta produkter baserat på ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Hämta ID från request-parametrarna
    try {
        const product = yield productService.getProductById(Number(id));
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch product' });
    }
});
exports.getProductById = getProductById;
//hämta produkter baserat på namn
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query; // Hämta sökparametern från förfrågan
    console.log('name:', name);
    if (!name) {
        res.status(400).json({ error: 'Name is missing' });
        return;
    }
    try {
        const products = yield (0, productService_1.getProductsByName)(name); // Anropa service-funktionen
        res.status(200).json(products);
    }
    catch (error) {
        console.error('Error in searchProducts:', error);
        res.status(500).json({ error: 'Something whent wrong during fetch' });
    }
});
exports.searchProducts = searchProducts;
//Hämta filtrerade produkter baserat på väder, temperatur, kategori och resealternativ
const getFilteredProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {
            categoryOne: req.query.categoryOne ? String(req.query.categoryOne) : null,
            categoryTwo: req.query.categoryTwo ? String(req.query.categoryTwo) : null,
            weather: req.query.weather ? String(req.query.weather) : null,
            temperature: req.query.temperature ? String(req.query.temperature) : null,
            travelOption: req.query.travelOption ? String(req.query.travelOption) : null,
        };
        const products = yield productService.getFilteredProductsBY(filters);
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});
exports.getFilteredProducts = getFilteredProducts;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield productService.getAllCategories();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
});
exports.getCategories = getCategories;
// Skapa en ny produkt
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productData = req.body;
    try {
        // Anropa servicefunktionen för att skapa produkten
        const result = yield (0, productService_1.createProduct)(productData);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to add product.' });
    }
});
exports.addProduct = addProduct;
// Hämta alla resealternativ
const getAllTravelOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [travelOptions] = yield db_1.default.query('SELECT id, name FROM TravelOptions');
        res.json(travelOptions);
    }
    catch (error) {
        console.error('Error fetching travel options:', error);
        res.status(500).json({ message: 'Failed to fetch travel options' });
    }
});
exports.getAllTravelOptions = getAllTravelOptions;
//hämta categorierna
const getAllCategoriesTwo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [categories] = yield db_1.default.query('SELECT id, name FROM CategoryTwo');
        res.json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
});
exports.getAllCategoriesTwo = getAllCategoriesTwo;
//Hämta temperaturspann
const getAllWeatherTemperatures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [weatherTemperatures] = yield db_1.default.query('SELECT id, name FROM WeatherTemperature');
        res.json(weatherTemperatures);
    }
    catch (error) {
        console.error('Error fetching weather temperatures:', error);
        res.status(500).json({ message: 'Failed to fetch weather temperatures' });
    }
});
exports.getAllWeatherTemperatures = getAllWeatherTemperatures;
//Hämta väder
const getAllWeatherOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [weatherOptions] = yield db_1.default.query('SELECT id, name FROM Weather');
        res.json(weatherOptions);
    }
    catch (error) {
        console.error('Error fetching weather options:', error);
    }
});
exports.getAllWeatherOptions = getAllWeatherOptions;
//hämta väder id
const getCategoriesId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryOne, categoryTwo } = req.body;
    if (!categoryOne || !categoryTwo) {
        res.status(400).json({ message: 'Both categoryOne and categoryTwo are required' });
        return;
    }
    try {
        const categoryOneId = yield (0, productService_1.getCategoryOneIdByName)(categoryOne);
        const categoryTwoId = yield (0, productService_1.getCategoryTwoIdByName)(categoryTwo);
        res.status(200).json({
            categoryOneId,
            categoryTwoId,
        });
    }
    catch (error) {
        console.error('Error fetching category IDs:', error);
        res.status(500).json({ message: 'Failed to fetch category IDs' });
    }
});
exports.getCategoriesId = getCategoriesId;
//Ändra om produkten finns att beställa eller inte 
const toggleInStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { in_stock, productId } = req.body;
    const parsedInStock = in_stock === 'true' ? true : in_stock === 'false' ? false : in_stock;
    // Kolla om in_stock är en boolean
    if (typeof in_stock !== 'boolean') {
        res.status(400).json({ message: '`in_stock` must be a boolean value (true or false).' });
        return;
    }
    try {
        const result = yield (0, productService_1.updateProductInStock)(productId, parsedInStock);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error in toggleInStock controller:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.toggleInStock = toggleInStock;
