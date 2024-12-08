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
    const connection = yield pool.getConnection();
    try {
        yield connection.beginTransaction();
        // 1. Skapa order
        const [orderResult] = yield connection.query('INSERT INTO Orders (user_email, address, is_paid) VALUES (?, ?, ?)', [userEmail, address, false]);
        const orderId = orderResult.insertId;
        let totalPrice = 0;
        // 2. Lägg till produkter och beräkna totalpris
        for (const item of items) {
            const [productRows] = yield connection.query('SELECT price FROM Products WHERE id = ?', [item.productId]);
            if (productRows.length === 0) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            const productPrice = productRows[0].price;
            totalPrice += productPrice * item.quantity;
            yield connection.query('INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, item.productId, item.quantity, productPrice]);
        }
        // 3. Uppdatera totalpris i Orders
        yield connection.query('UPDATE Orders SET total_price = ? WHERE id = ?', [totalPrice, orderId]);
        yield connection.commit();
        return { orderId, totalPrice };
    }
    catch (err) {
        yield connection.rollback();
        throw err;
    }
    finally {
        connection.release();
    }
});
exports.createOrderService = createOrderService;
