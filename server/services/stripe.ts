import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.STRIPE_KEY;
if (!apiKey) {
    throw new Error('STRIPE_SECRET is not defined in environment variables');
}
const stripe = new Stripe(apiKey, { apiVersion: '2024-11-20.acacia' });

