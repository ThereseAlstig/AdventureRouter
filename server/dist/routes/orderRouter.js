"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.post('/createOrders', (req, res, next) => {
    next();
}, authMiddleware_1.ensureAuthenticated, orderController_1.createOrder);
router.post('/createCart', (req, res, next) => {
    next();
}, orderController_1.CreateCart);
router.get('/fetchCart', orderController_1.fetchCart);
router.post('/clearCartByEmail', authMiddleware_1.ensureAuthenticated, (0, orderController_1.clearCartByEmailController)());
router.post('/transferAnonymousCart', orderController_1.transferAnonymousCartController);
router.post('/updateCartItem', orderController_1.updateCartItem);
exports.default = router;
