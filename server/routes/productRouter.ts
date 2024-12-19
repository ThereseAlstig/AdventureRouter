import express from 'express';
import { getProducts, addProduct, getFilteredProducts, getCategories, getAllWeatherOptions, getAllWeatherTemperatures, getAllTravelOptions, getAllCategoriesTwo, getProductById, getCategoriesId } from '../controllers/productControllers';


const router = express.Router();

router.get('/', getProducts);
router.get('/filtered', getFilteredProducts);
router.get('/categories', getCategories);
router.post('/', addProduct);
router.get('/categoriesTwo', getAllCategoriesTwo);
router.get('/travel-options', getAllTravelOptions);
router.get('/weather-temperatures', getAllWeatherTemperatures);
router.get('/weather-options', getAllWeatherOptions);
router.get('/:id', getProductById);
router.post('/categoryId', getCategoriesId);


export default router;
