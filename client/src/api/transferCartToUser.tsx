

const TransferCartToUser = async (cartId: string, email: string) => {

    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;


    try {
   
        const response = await fetch(`${backendUrl}/orders/transferAnonymousCart`, {
            method: 'POST',
            headers: { 
            'Content-Type': 'application/json' },
            body: JSON.stringify({cartId, email}),
        });

        const data = await response.json();
        console.log('Order created successfully:', data);
    } catch (error) {
        console.error('Error creating order:', error);
    }
};

export default TransferCartToUser;