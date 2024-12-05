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
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const connection = await pool.getConnection();
  try {
    // Starta en transaktion
    await connection.beginTransaction();

    // 2. Infoga order i Orders-tabellen
    const [orderResult] = await connection.query<ResultSetHeader>(
      'INSERT INTO Orders (user_email, total_price, address) VALUES (?, ?)',
      [userEmail, totalPrice, address]
    );

    const orderId = orderResult.insertId; // ID för den nya ordern

    // 3. Infoga varje produkt i OrderItems-tabellen
    for (const item of items) {
      await connection.query(
        'INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    // Bekräfta transaktionen
    await connection.commit();

    // Returnera orderns information
    return {
      orderId,
      userEmail,
      totalPrice,
      address,
      items,
      createdAt: new Date(),
    };
  } catch (err) {
    // Återställ transaktionen vid fel
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
