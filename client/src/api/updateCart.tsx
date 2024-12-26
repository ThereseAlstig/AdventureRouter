//Uppdaterar kundkorgen

const updateCart = async (cartId: string, productId: number, quantity: number) => {

    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;


    try {
  
        const response = await fetch(`${backendUrl}/orders/updateCartItem`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId, productId, quantity }),
        });

        const data = await response.json();
      console.log('Order created successfully:', data);
    } catch (error) {
        console.error('Error creating order:', error);
    }
};

export default updateCart;