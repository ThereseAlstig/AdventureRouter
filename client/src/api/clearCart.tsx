
//Tömma kundvagnen, görs efter genomfört köp
const ClearCart = async () => {

    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
const token = sessionStorage.getItem('token');

    try {
       const userEmail = sessionStorage.getItem('userEmail');
        const response = await fetch(`${backendUrl}/orders/clearCartByEmail`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' },
            body: JSON.stringify({userEmail}),
        });

        const data = await response.json();
        console.log('Order created successfully:', data);
    } catch (error) {
        console.error('Error creating order:', error);
    }
};

export default ClearCart;