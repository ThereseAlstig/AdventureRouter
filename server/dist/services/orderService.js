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
exports.transferAnonymousCartService = exports.clearCartByEmailService = exports.getProductsByIds = exports.getCartItems = exports.addToCartService = exports.createOrderService = void 0;
const db_1 = __importDefault(require("../config/db"));
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
        console.log('email:', email);
        console.log('cartId:', cartId);
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
                console.log('New cart created for user:', userId, 'with cart ID:', cartIdToUse);
            }
        }
        // Om användaren är anonym eller har ett befintligt cartId
        if (cartIdToUse) {
            const [cartRows] = yield pool.query('SELECT cart_id FROM Carts WHERE cart_id = ?', [cartIdToUse]);
            if (cartRows.length === 0) {
                // Skapa en ny kundvagn i databasen om ID:t inte finns
                yield pool.query('INSERT INTO Carts (cart_id) VALUES (?)', [cartIdToUse]);
                console.log('Cart ID did not exist, new cart created:', cartIdToUse);
            }
        }
        else {
            // Skapa ett nytt cartId om inget ID finns och användaren är anonym
            cartIdToUse = crypto.randomUUID();
            yield pool.query('INSERT INTO Carts (cart_id) VALUES (?)', [cartIdToUse]);
            console.log('New cart created for anonymous user with ID:', cartIdToUse);
        }
        // Lägg till produkten i kundkorgen
        const [existingProductRows] = yield pool.query('SELECT * FROM CartItems WHERE cart_id = ? AND product_id = ?', [cartIdToUse, productId]);
        if (existingProductRows.length > 0) {
            // Uppdatera kvantiteten om produkten redan finns
            yield pool.query('UPDATE CartItems SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?', [quantity, cartIdToUse, productId]);
            console.log('Product quantity updated in cart:', productId);
        }
        else {
            // Lägg till en ny produkt i kundkorgen
            yield pool.query('INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartIdToUse, productId, quantity]);
            console.log('Product added to cart with ID:', cartIdToUse);
        }
        // Returnera den uppdaterade kundkorgen
        const [cartItems] = yield pool.query('SELECT * FROM CartItems WHERE cart_id = ?', [cartIdToUse]);
        return { cartId: cartIdToUse, items: cartItems };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error in addToCartService:', error.message);
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
const getProductsByIds = (productIds) => __awaiter(void 0, void 0, void 0, function* () {
    // Kontrollera om productIds inte är tomt
    if (!productIds) {
        return [];
    }
    try {
        // Skapa en parameteriserad query
        const query = `
          SELECT id, price 
          FROM Products 
          WHERE id in (?);
      `;
        // Kör queryn och skicka in produkt-ID:n som parameter
        const [rows] = yield db_1.default.query(query, [productIds]);
        console.log('Product fetched:', rows);
        // Returnera resultaten i önskat format
        return rows.map((row) => ({
            id: row.id,
            price: parseFloat(row.price), // Konvertera från sträng till nummer
        }));
    }
    catch (error) {
        console.error('Error fetching products by IDs:', error);
        throw new Error('Failed to fetch products from database');
    }
});
exports.getProductsByIds = getProductsByIds;
// ta bort innehåll i kundkorgen
const clearCartByEmailService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Hämta användarens cart_id baserat på e-post
        const [cartRows] = yield db_1.default.query('SELECT cart_id FROM Carts INNER JOIN users ON Carts.user_id = users.id WHERE users.email = ?', [email]);
        const cart = cartRows[0];
        if (!cart) {
            throw new Error('No cart found for this user.');
        }
        const cartId = cart.cart_id;
        // Ta bort alla produker från kundkorgen
        yield db_1.default.query('DELETE FROM CartItems WHERE cart_id = ?', [cartId]);
        console.log(`Cart cleared for user with email: ${email}`);
    }
    catch (error) {
        throw new Error(`Failed to clear cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});
exports.clearCartByEmailService = clearCartByEmailService;
// För över anonym kundkorg till inloggad användare
const transferAnonymousCartService = (cardId, email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [userRows] = yield db_1.default.query('SELECT id FROM users WHERE email = ?', [email]);
    const user = userRows[0];
    if (!user)
        throw new Error('User not found');
    const userId = user.id;
    const [cartRows] = yield db_1.default.query('SELECT cart_id FROM Carts WHERE user_id = ?', [userId]);
    let userCartId = (_a = cartRows[0]) === null || _a === void 0 ? void 0 : _a.cart_id;
    if (!cardId) {
        userCartId = crypto.randomUUID();
        yield db_1.default.query('INSERT INTO Carts (cart_id, user_id) VALUES (?, ?)', [userCartId, userId]);
    }
    const [anonymousCartItems] = yield db_1.default.query('SELECT product_id, quantity FROM CartItems WHERE cart_id = ?', [cardId]);
    for (const item of anonymousCartItems) {
        const [existingItems] = yield db_1.default.query('SELECT quantity FROM CartItems WHERE cart_id = ? AND product_id = ?', [userCartId, item.product_id]);
        if (existingItems.length > 0) {
            yield db_1.default.query('UPDATE CartItems SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?', [item.quantity, userCartId, item.product_id]);
        }
        else {
            yield db_1.default.query('INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (?, ?, ?)', [userCartId, item.product_id, item.quantity]);
        }
    }
    // Radera den anonyma kundkorgen
    yield db_1.default.query('DELETE FROM CartItems WHERE cart_id = ?', [cardId]);
    yield db_1.default.query('DELETE FROM Carts WHERE cart_id = ?', [cardId]);
});
exports.transferAnonymousCartService = transferAnonymousCartService;
