import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.STRIPE_KEY;
if (!apiKey) {
    throw new Error('STRIPE_SECRET is not defined in environment variables');
}
const stripe = new Stripe(apiKey, { apiVersion: '2024-11-20.acacia' });

// export const createPaymentIntent = async (req, res) => {
//     try {
//         const { cartItems }: { cartItems: { productId: string; quantity: number }[] } = req.body;

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount,
//             currency: 'sek',
//             payment_method_types: ['card'],
//         });

//         res.json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         console.error('Error creating payment intent:', error.raw || error);
//         res.status(500).json({ error: error.message || 'Failed to create payment intent' });
//     }
// };