import express from 'express';
import { getProducts, addProduct, getFilteredProducts, getCategories, getAllWeatherOptions, getAllWeatherTemperatures, getAllTravelOptions, getAllCategoriesTwo, getProductById, getCategoriesId, searchProducts, toggleInStock } from '../controllers/productControllers';
import { ensureAuthenticated, verifyAdmin } from '../middleware/authMiddleware';
import e from 'express';


const router = express.Router();

router.get('/', getProducts);
router.get('/filtered', getFilteredProducts);
router.get('/categories', getCategories);
router.post('/', ensureAuthenticated, verifyAdmin, addProduct);
router.get('/categoriesTwo', getAllCategoriesTwo);
router.get('/travel-options', getAllTravelOptions);
router.get('/weather-temperatures', getAllWeatherTemperatures);
router.get('/weather-options', getAllWeatherOptions);

router.post('/categoryId', getCategoriesId);
router.get('/search', ensureAuthenticated, verifyAdmin,  searchProducts);
router.get('/:id', getProductById);
router.post('/uppdate', ensureAuthenticated, verifyAdmin, toggleInStock);

export default router;
