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
exports.getCartItems = exports.addToCartService = exports.createOrderService = void 0;
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
const addToCartService = (pool, email, cartId, productId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cartIdToUse = cartId;
        // Om användaren är inloggad, koppla kundkorgen till användarens e-post
        if (email) {
            const [userRows] = yield pool.query('SELECT id FROM users WHERE email = ?', [email]);
            const user = userRows[0];
            if (!user) {
                throw new Error('User not found');
            }
            const userId = user.id;
            // Kontrollera om kundkorgen redan finns för användaren
            const [cartRows] = yield pool.query('SELECT cart_id FROM Carts WHERE user_id = ?', [userId]);
            const existingCart = cartRows[0];
            if (existingCart) {
                cartIdToUse = existingCart.cart_id;
            }
            else {
                // Skapa en ny kundkorg om ingen finns
                cartIdToUse = crypto.randomUUID();
                yield pool.query('INSERT INTO Carts (cart_id, user_id) VALUES (?, ?)', [cartIdToUse, userId]);
            }
        }
        // Om användaren är anonym, använd `cartId` eller skapa en ny
        if (!cartIdToUse) {
            cartIdToUse = crypto.randomUUID(); // Generera ett nytt UUID för anonyma användare
            yield pool.query('INSERT INTO Carts (cart_id) VALUES (?)', [cartIdToUse]);
        }
        // Lägg till produkten i kundkorgen
        const [existingProductRows] = yield pool.query('SELECT * FROM CartItems WHERE cart_id = ? AND product_id = ?', [cartIdToUse, productId]);
        if (existingProductRows.length > 0) {
            // Uppdatera kvantiteten om produkten redan finns
            yield pool.query('UPDATE CartItems SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?', [quantity, cartIdToUse, productId]);
        }
        else {
            // Lägg till en ny produkt i kundkorgen
            yield pool.query('INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartIdToUse, productId, quantity]);
        }
        // Returnera den uppdaterade kundkorgen
        const [cartItems] = yield pool.query('SELECT * FROM CartItems WHERE cart_id = ?', [cartIdToUse]);
        return { cartId: cartIdToUse, items: cartItems };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to add to cart: ${error.message}`);
        }
        else {
            throw new Error('Failed to add to cart: Unknown error');
        }
    }
});
exports.addToCartService = addToCartService;
const getCartItems = (pool, email, cartId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query;
        let params;
        if (email) {
            // Om användaren är inloggad, hämta kundkorgen baserat på e-post
            query = `
                SELECT ci.product_id, ci.quantity, p.name, p.price, p.image_url
                FROM CartItems ci
                INNER JOIN Carts c ON ci.cart_id = c.cart_id
                INNER JOIN Products p ON ci.product_id = p.id
                INNER JOIN users u ON c.user_id = u.id
                WHERE u.email = ?;
            `;
            params = [email];
        }
        else if (cartId) {
            // Om användaren är anonym, hämta kundkorgen baserat på `cartId`
            query = `
                SELECT ci.product_id, ci.quantity, p.name, p.price, p.image_url
                FROM CartItems ci
                INNER JOIN Carts c ON ci.cart_id = c.cart_id
                INNER JOIN Products p ON ci.product_id = p.id
                WHERE c.cart_id = ?;
            `;
            params = [cartId];
        }
        else {
            throw new Error('Either email or cartId must be provided');
        }
        // Kör frågan och returnera resultaten
        const [rows] = yield pool.query(query, params);
        return rows; // Returnera produkter i kundkorgen
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching cart items:', error.message);
        }
        else {
            console.error('Error fetching cart items:', error);
        }
        throw new Error('Failed to fetch cart items');
    }
});
exports.getCartItems = getCartItems;
