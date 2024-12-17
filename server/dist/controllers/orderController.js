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
exports.transferAnonymousCartController = exports.clearCartByEmailController = exports.fetchCart = exports.CreateCart = exports.createOrder = void 0;
const orderService_1 = require("../services/orderService");
const db_1 = __importDefault(require("../config/db"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('createOrder');
    try {
        const orderData = req.body; // Hämta från request-body
        if (!orderData.address) {
            res.status(400).json({ message: 'Address is required' });
            return;
        }
        // Anropa service för att skapa order
        const newOrder = yield (0, orderService_1.createOrderService)(db_1.default, orderData);
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create order', error: err.message });
    }
});
exports.createOrder = createOrder;
const CreateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('CreateCart');
    const { email, productId, quantity, cartId } = req.body; // Hämta från request-body
    // För anonyma användare, lagras isessionStorage
    let cart;
    try {
        const createCart = yield (0, orderService_1.addToCartService)(db_1.default, email, cartId, productId, quantity);
        res.status(201).json({ message: 'Cart created successfully', cart: createCart });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create cart', error: err.message });
    }
});
exports.CreateCart = CreateCart;
const fetchCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = req.query.email) !== null && _a !== void 0 ? _a : null;
        const cartId = (_b = req.query.cartId) !== null && _b !== void 0 ? _b : null;
        // Hämta produkter från kundkorgen
        const cartItems = yield (0, orderService_1.getCartItems)(db_1.default, email, cartId);
        // Returnera kundkorgen
        res.status(200).json({ cartItems });
    }
    catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
    }
});
exports.fetchCart = fetchCart;
const clearCartByEmailController = () => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = req.user;
        const userEmail = user.email;
        yield (0, orderService_1.clearCartByEmailService)(userEmail);
        res.json({ message: 'Cart cleared successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.clearCartByEmailController = clearCartByEmailController;
const transferAnonymousCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId, email } = req.body;
        if (!email || !cartId) {
            res.status(400).json({ message: 'Email and anonymous cart ID are required.' });
            return;
        }
        // Anropa servicen för att föra över kundkorgen och radera den anonyma
        yield (0, orderService_1.transferAnonymousCartService)(cartId, email);
        res.json({ message: 'Cart transferred and anonymous cart deleted successfully.' });
    }
    catch (error) {
        console.error('Error transferring cart:', error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.transferAnonymousCartController = transferAnonymousCartController;
