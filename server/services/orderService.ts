import { Pool, ResultSetHeader } from 'mysql2/promise';

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
