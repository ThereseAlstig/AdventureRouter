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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getAllWeatherOptions = exports.getAllWeatherTemperatures = exports.getAllCategoriesTwo = exports.getAllTravelOptions = exports.addProduct = exports.getCategories = exports.getFilteredProducts = exports.getProducts = void 0;
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
const getFilteredProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {
            categoryOne: req.query.categoryOne ? String(req.query.categoryOne) : null,
            categoryTwo: req.query.categoryTwo ? String(req.query.categoryTwo) : null,
            weather: req.query.weather ? String(req.query.weather) : null,
            temperature: req.query.temperature ? String(req.query.temperature) : null,
            travelOptionId: req.query.travelOptionId ? Number(req.query.travelOptionId) : null,
        };
        const products = yield productService.getFilteredProductsBY(filters);
        console.log('Filtered products fetchedjljlkjlkjl:', products);
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
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('addProduct');
    const productData = req.body; // Hämta produktdata från POST-begäran
    try {
        // Anropa servicefunktionen för att skapa produkten
        const result = yield (0, productService_1.createProduct)(productData);
        res.status(201).json(result); // Skicka tillbaka resultatet från databasen
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
