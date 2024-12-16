import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentFormProps {
    clientSecret: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState<string>('');

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setPaymentStatus('Stripe has not loaded yet.');
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
            }
        } catch (error: any) {
            setPaymentStatus(`Unexpected error: ${error.message}`);
        }
    };

    return (
        <div>
            <form onSubmit={handlePayment}>
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
