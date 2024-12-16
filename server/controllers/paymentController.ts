import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { getProductsByIds } from '../services/orderService';
dotenv.config();

const apiKey = process.env.STRIPE_KEY;
if (!apiKey) {
    throw new Error('STRIPE_SECRET is not defined in environment variables');
}

const stripe = new Stripe(apiKey, { apiVersion: '2024-11-20.acacia' });

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { cartItems }: { cartItems: { productId: number; quantity: number }[] } = req.body;

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            throw new Error('Invalid or empty cartItems');
        }
        // hämtar produkter för att räkna ut totalbeloppet
        const products = await getProductsByIds(cartItems.map((item) => item.productId));
        if (!products || products.length === 0) {
            throw new Error('No matching products found for provided IDs');
        }
        console.log('products:', products);
        console.log('cartItems:', cartItems);
      
       
        const totalAmount = products.reduce((total, product) => {
            const cartItem = cartItems.find((item) => item.productId === product.id);
            console.log('cartItem:', cartItem);
            if (!cartItem) throw new Error(`Product ID ${product.id} not found in cart`);

            return total + product.price * cartItem.quantity;
        }, 0);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100),
            currency: 'sek',
            payment_method_types: ['card'],
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret, totalAmount });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({ error: 'Failed to create payment intent', details: error.message });
        } else {
            console.error('Unknown error creating payment intent:', error);
            res.status(500).json({ error: 'Failed to create payment intent', details: 'Unknown error' });
        }
    }
};

