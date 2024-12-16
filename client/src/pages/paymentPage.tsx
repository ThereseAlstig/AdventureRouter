import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/paymentForm';


// Ersätt med din Stripe public key
interface PaymentPageProps {
    items: { productId: number; quantity: number }[];
}
const PaymentPage: React.FC<PaymentPageProps> = ({ items }) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
const stripeKey = import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(`${stripeKey}`); 

const handleCheckout = async () => {
    try {
        // Skicka items till backend
        const clientSecret = await createPaymentIntent(items);
        setClientSecret(clientSecret);
    } catch (error) {
        console.error('Error during checkout:', error);
    }
};
const createPaymentIntent = async (cartItems: { productId: number; quantity: number }[]): Promise<string> =>{
        try {
            console.log('cartItems', cartItems);
            const response = await fetch(`${backendUrl}/payment/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems }),  // Exempel: 1000 öre = 10 SEK
            });

            const data = await response.json();
            setClientSecret(data.clientSecret);
            return data.clientSecret;
        } catch (error) {
            console.error('Error fetching payment intent:', error);
            throw error;
        }
    };

    return (
        <div>
            <h1>Payment Page</h1>
            {!clientSecret ? (
                <button onClick={handleCheckout}>Start Payment</button>
            ) : (
                <Elements stripe={stripePromise}>
                    <PaymentForm clientSecret={clientSecret} />
                </Elements>
            )}
        </div>
    );
};

export default PaymentPage;
