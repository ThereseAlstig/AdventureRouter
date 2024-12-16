import { Request, Response } from 'express';
import { addToCartService, createOrderService, getCartItems } from '../services/orderService';
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


export const CreateCart = async (req: Request, res: Response): Promise<void> => {
    console.log('CreateCart');

    const { email, productId, quantity, cartId } = req.body; // Hämta från request-body
    // För anonyma användare, lagras som cookie
    let cart;
    try {
     const createCart = await addToCartService(pool, email, cartId, productId, quantity);
     res.status(201).json({ message: 'Cart created successfully', cart: createCart });
    
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create cart', error: err.message });
  }
}

export const fetchCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = (req.query.email as string | undefined) ?? null;
    const cartId = (req.query.cartId as string | undefined) ?? null;

      // Hämta produkter från kundkorgen
      const cartItems = await getCartItems(pool, email, cartId);

      // Returnera kundkorgen
      res.status(200).json({ cartItems });
  } catch (error) {
      console.error('Error fetching cart:', (error as any).message);
      res.status(500).json({ message: 'Failed to fetch cart', error: (error as Error).message });
  }
};