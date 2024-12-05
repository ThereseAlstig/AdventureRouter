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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderService = void 0;
const createOrderService = (pool, orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail, items, address } = orderData;
    // 1. Beräkna totalpris
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const connection = yield pool.getConnection();
    try {
        // Starta en transaktion
        yield connection.beginTransaction();
        // 2. Infoga order i Orders-tabellen
        const [orderResult] = yield connection.query('INSERT INTO Orders (user_email, total_price, address) VALUES (?, ?)', [userEmail, totalPrice, address]);
        const orderId = orderResult.insertId; // ID för den nya ordern
        // 3. Infoga varje produkt i OrderItems-tabellen
        for (const item of items) {
            yield connection.query('INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, item.productId, item.quantity, item.price]);
        }
        // Bekräfta transaktionen
        yield connection.commit();
        // Returnera orderns information
        return {
            orderId,
            userEmail,
            totalPrice,
            address,
            items,
            createdAt: new Date(),
        };
    }
    catch (err) {
        // Återställ transaktionen vid fel
        yield connection.rollback();
        throw err;
    }
    finally {
        connection.release();
    }
});
exports.createOrderService = createOrderService;
