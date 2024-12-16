import { Pool, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';

interface OrderItem {
  productId: number;
  quantity: number;
  price: number; // Pris per produkt
}

interface OrderData {
  userEmail: string;
  items: OrderItem[];
    address: string;
}

export const createOrderService = async (pool: Pool, orderData: OrderData) => {
  
  const { userEmail, items, address } = orderData;

  // 1. Beräkna totalpris
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Skapa order
    const [orderResult] = await connection.query(
      'INSERT INTO Orders (user_email, address, is_paid) VALUES (?, ?, ?)',
      [userEmail, address, false]
    );

    const orderId = (orderResult as ResultSetHeader).insertId;

    let totalPrice = 0;

    // 2. Lägg till produkter och beräkna totalpris
    for (const item of items) {
      const [productRows] = await connection.query<any[]>(
        'SELECT price FROM Products WHERE id = ?',
        [item.productId]
      );

      if (productRows.length === 0) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      const productPrice = productRows[0].price;
      totalPrice += productPrice * item.quantity;

      await connection.query(
        'INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, productPrice]
      );
    }

    // 3. Uppdatera totalpris i Orders
    await connection.query(
      'UPDATE Orders SET total_price = ? WHERE id = ?',
      [totalPrice, orderId]
    );

    await connection.commit();

    return { orderId, totalPrice };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};






export const addToCartService = async (
    pool: Pool,
    email: string | undefined,
    cartId: string | undefined,
    productId: number,
    quantity: number
): Promise<any> => {
    try {
        let cartIdToUse = cartId;

        // Om användaren är inloggad, koppla kundkorgen till användarens e-post
        if (email) {
            const [userRows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
            const user = (userRows as any[])[0];

            if (!user) {
                throw new Error('User not found');
            }

            const userId = user.id;

            // Kontrollera om kundkorgen redan finns för användaren
            const [cartRows] = await pool.query('SELECT cart_id FROM Carts WHERE user_id = ?', [userId]);
            const existingCart = (cartRows as any[])[0];

            if (existingCart) {
                cartIdToUse = existingCart.cart_id;
            } else {
                // Skapa en ny kundkorg om ingen finns
                cartIdToUse = crypto.randomUUID();
                await pool.query('INSERT INTO Carts (cart_id, user_id) VALUES (?, ?)', [cartIdToUse, userId]);
            }
        }

        // Om användaren är anonym, använd `cartId` eller skapa en ny
        if (!cartIdToUse) {
            cartIdToUse = crypto.randomUUID(); // Generera ett nytt UUID för anonyma användare
            await pool.query('INSERT INTO Carts (cart_id) VALUES (?)', [cartIdToUse]);
        }

        // Lägg till produkten i kundkorgen
        const [existingProductRows] = await pool.query<any[]>(
            'SELECT * FROM CartItems WHERE cart_id = ? AND product_id = ?',
            [cartIdToUse, productId]
        );

        if (existingProductRows.length > 0) {
            // Uppdatera kvantiteten om produkten redan finns
            await pool.query(
                'UPDATE CartItems SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
                [quantity, cartIdToUse, productId]
            );
        } else {
            // Lägg till en ny produkt i kundkorgen
            await pool.query(
                'INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cartIdToUse, productId, quantity]
            );
        }

        // Returnera den uppdaterade kundkorgen
        const [cartItems] = await pool.query('SELECT * FROM CartItems WHERE cart_id = ?', [cartIdToUse]);
        return { cartId: cartIdToUse, items: cartItems };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to add to cart: ${error.message}`);
        } else {
            throw new Error('Failed to add to cart: Unknown error');
        }
    }
};




export const getCartItems = async (pool: Pool, email: string | null, cartId: string | null) => {
    try {
        let query: string;
        let params: (string | null)[];

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
        } else if (cartId) {
            // Om användaren är anonym, hämta kundkorgen baserat på `cartId`
            query = `
                SELECT ci.product_id, ci.quantity, p.name, p.price, p.image_url
                FROM CartItems ci
                INNER JOIN Carts c ON ci.cart_id = c.cart_id
                INNER JOIN Products p ON ci.product_id = p.id
                WHERE c.cart_id = ?;
            `;
            params = [cartId];
        } else {
            throw new Error('Either email or cartId must be provided');
        }

        // Kör frågan och returnera resultaten
        const [rows] = await pool.query(query, params);
        return rows; // Returnera produkter i kundkorgen
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching cart items:', error.message);
        } else {
            console.error('Error fetching cart items:', error);
        }
        throw new Error('Failed to fetch cart items');
    }
};


export const getProductsByIds = async (productIds: number[]): Promise<{ id: number; price: number }[]> => {
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
      const [rows]: any = await pool.query(query, [productIds]);
console.log('Product fetched:', rows);
      // Returnera resultaten i önskat format
      return rows.map((row: { id: number; price: string }) => ({
        id: row.id,
        price: parseFloat(row.price), // Konvertera från sträng till nummer
    }));
    
  } catch (error) {
      console.error('Error fetching products by IDs:', error);
      throw new Error('Failed to fetch products from database');
  }
};