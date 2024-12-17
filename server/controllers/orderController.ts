import { Request, Response } from 'express';
import { addToCartService, clearCartByEmailService, createOrderService, getCartItems, transferAnonymousCartService } from '../services/orderService';
import pool from '../config/db'; 
import { IUser } from '../models/userModel';

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
    // För anonyma användare, lagras isessionStorage
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

export const clearCartByEmailController = () => async (req: Request, res: Response) => {
  try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const user = req.user as IUser;
      const userEmail = user.email; 
      await clearCartByEmailService(userEmail);
      res.json({ message: 'Cart cleared successfully.' });
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
};

export const transferAnonymousCartController= async (req: Request, res: Response): Promise<void> => {
  try {
      const { cartId, email } = req.body;

      if (!email || !cartId) {
        res.status(400).json({ message: 'Email and anonymous cart ID are required.' });
        return 
    }
      // Anropa servicen för att föra över kundkorgen och radera den anonyma
      await transferAnonymousCartService(cartId, email);

      res.json({ message: 'Cart transferred and anonymous cart deleted successfully.' });
  } catch (error: any) {
      console.error('Error transferring cart:', error.message);
      res.status(500).json({ message: error.message });
  }

};