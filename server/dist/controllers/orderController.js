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
exports.createOrder = void 0;
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
