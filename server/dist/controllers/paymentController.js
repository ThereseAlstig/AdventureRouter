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
exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const orderService_1 = require("../services/orderService");
dotenv_1.default.config();
const apiKey = process.env.STRIPE_KEY;
if (!apiKey) {
    throw new Error('STRIPE_SECRET is not defined in environment variables');
}
const stripe = new stripe_1.default(apiKey, { apiVersion: '2024-11-20.acacia' });
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartItems } = req.body;
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            throw new Error('Invalid or empty cartItems');
        }
        // hämtar produkter för att räkna ut totalbeloppet
        const products = yield (0, orderService_1.getProductsByIds)(cartItems.map((item) => item.productId));
        if (!products || products.length === 0) {
            throw new Error('No matching products found for provided IDs');
        }
        console.log('products:', products);
        console.log('cartItems:', cartItems);
        const totalAmount = products.reduce((total, product) => {
            const cartItem = cartItems.find((item) => item.productId === product.id);
            console.log('cartItem:', cartItem);
            if (!cartItem)
                throw new Error(`Product ID ${product.id} not found in cart`);
            return total + product.price * cartItem.quantity;
        }, 0);
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100),
            currency: 'sek',
            payment_method_types: ['card'],
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret, totalAmount });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({ error: 'Failed to create payment intent', details: error.message });
        }
        else {
            console.error('Unknown error creating payment intent:', error);
            res.status(500).json({ error: 'Failed to create payment intent', details: 'Unknown error' });
        }
    }
});
exports.createPaymentIntent = createPaymentIntent;
