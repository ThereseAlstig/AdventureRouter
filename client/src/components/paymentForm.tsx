import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import  createOrder  from '../api/createOrder';
import ClearCart from '../api/clearCart';
import { useNavigate } from 'react-router-dom';
interface PaymentFormProps {
    clientSecret: string;
    items: { productId: number; quantity: number }[];
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, items }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const userEmail = sessionStorage.getItem('userEmail');
    const  navigate  = useNavigate();
    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setPaymentStatus('Stripe has not loaded yet.');
            return;
        }
        if (!address) {
            setPaymentStatus('Please enter your address before proceeding.');
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setPaymentStatus('Card element not found.');
            return;
        }

        try {
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                setPaymentStatus(`Payment failed: ${error.message}`);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                setPaymentStatus('Payment successful!');
                const orderData = {
                    userEmail,
                    address,
                    items,
                };
                await createOrder(orderData);
                await ClearCart();
                navigate('/tank-you')
            }
        } catch (error: any) {
            setPaymentStatus(`Unexpected error: ${error.message}`);
        }
    };

    return (
        <div>
            <form onSubmit={handlePayment}>
            <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        aria-label="Youre delivery address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your delivery address"
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }}
                />
                <button type="submit" disabled={!stripe}>
                    Pay
                </button>
            </form>
            {paymentStatus && <p>{paymentStatus}</p>}
        </div>
    );
};

export default PaymentForm;
