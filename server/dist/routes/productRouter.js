"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productControllers_1 = require("../controllers/productControllers");
const router = express_1.default.Router();
router.get('/', productControllers_1.getProducts);
router.get('/filtered', productControllers_1.getFilteredProducts);
router.get('/categories', productControllers_1.getCategories);
router.post('/', productControllers_1.addProduct);
router.get('/categoriesTwo', productControllers_1.getAllCategoriesTwo);
router.get('/travel-options', productControllers_1.getAllTravelOptions);
router.get('/weather-temperatures', productControllers_1.getAllWeatherTemperatures);
router.get('/weather-options', productControllers_1.getAllWeatherOptions);
exports.default = router;
