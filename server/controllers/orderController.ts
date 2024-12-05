import { Request, Response } from 'express';
import { createOrderService } from '../services/orderService';
import pool from '../config/db'; 

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    console.log('createOrder');
  try {
    const orderData = req.body; // Hämta från request-body
    if (!orderData.address) {
       res.status(400).json({ message: 'Address is required' });
       return;
      }
    // Anropa service för att skapa order
    const newOrder = await createOrderService(pool, orderData);

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};
