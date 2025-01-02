import { Pool, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';
import * as crypto from 'crypto';

interface OrderItem {
  productId: number;
  quantity: number;
  // Pris per produkt
}

interface OrderData {
  userEmail: string;
  items: OrderItem[];
    address: string;
}


// Skapa en order
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


//SKapa och lägga i kundkorgen
export const addToCartService = async (
    pool: Pool,
    email: string | undefined,
    cartId: string | undefined,
    productId: number,
    quantity: number
): Promise<any> => {
    try {
        let cartIdToUse = cartId;

        console.log('email:', email);
        console.log('cartId:', cartId);

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

        // Om användaren är anonym eller har ett befintligt cartId
        if (cartIdToUse) {
            const [cartRows] = await pool.query<any[]>(
                'SELECT cart_id FROM Carts WHERE cart_id = ?',
                [cartIdToUse]
            );

            if (cartRows.length === 0) {
                // Skapa en ny kundvagn i databasen om ID:t inte finns
                await pool.query('INSERT INTO Carts (cart_id) VALUES (?)', [cartIdToUse]);
                
            }
        } else {
            // Skapa ett nytt cartId om inget ID finns och användaren är anonym
            cartIdToUse = crypto.randomUUID();
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
            console.error('Error in addToCartService:', error.message);
            throw new Error(`Failed to add to cart: ${error.message}`);
        } else {
            throw new Error('Failed to add to cart: Unknown error');
        }
    }
};




//Hämta kundkorgen till användaren
export const getCartItems = async (pool: Pool, email: string | null, cartId: string | null) => {
    try {
        let query: string;
        let params: (string | null)[];

        if (email) {
            // Om användaren är inloggad, hämta kundkorgen baserat på e-post
            query = `
                SELECT ci.product_id, ci.quantity, p.name, p.price, p.image_url, c.cart_id
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
                SELECT ci.product_id, ci.quantity, p.name, p.price, p.image_url, c.cart_id
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

// ta bort innehåll i kundkorgen
export const clearCartByEmailService = async ( email: string): Promise<void> => {
    try {
        // Hämta användarens cart_id baserat på e-post
        const [cartRows] = await pool.query(
            'SELECT cart_id FROM Carts INNER JOIN users ON Carts.user_id = users.id WHERE users.email = ?',
            [email]
        );

        const cart = (cartRows as any[])[0];

        if (!cart) {
            throw new Error('No cart found for this user.');
        }

        const cartId = cart.cart_id;

        // Ta bort alla produker från kundkorgen
        await pool.query('DELETE FROM CartItems WHERE cart_id = ?', [cartId]);
       
    } catch (error) {
        throw new Error(`Failed to clear cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

// För över anonym kundkorg till inloggad användare
export const transferAnonymousCartService = async (
   
    cardId: string,
    email: string
): Promise<void> => {
    const [userRows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    const user = (userRows as any[])[0];
    if (!user) throw new Error('User not found');

    const userId = user.id;

    const [cartRows] = await pool.query('SELECT cart_id FROM Carts WHERE user_id = ?', [userId]);
    let userCartId = (cartRows as any[])[0]?.cart_id;

    if (!cardId) {
        userCartId = crypto.randomUUID();
        await pool.query('INSERT INTO Carts (cart_id, user_id) VALUES (?, ?)', [userCartId, userId]);
    }

    const [anonymousCartItems] = await pool.query(
        'SELECT product_id, quantity FROM CartItems WHERE cart_id = ?',
        [cardId]
    );

    for (const item of anonymousCartItems as any[]) {
        const [existingItems]: [any[], any] = await pool.query(
            'SELECT quantity FROM CartItems WHERE cart_id = ? AND product_id = ?',
            [userCartId, item.product_id]
        );

        if (existingItems.length > 0) {
            await pool.query(
                'UPDATE CartItems SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
                [item.quantity, userCartId, item.product_id]
            );
        } else {
            await pool.query(
                'INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [userCartId, item.product_id, item.quantity]
            );
        }
    }

    // Radera den anonyma kundkorgen
    await pool.query('DELETE FROM CartItems WHERE cart_id = ?', [cardId]);
    await pool.query('DELETE FROM Carts WHERE cart_id = ?', [cardId]);
};