const createOrder = async (orderData: any) => {

    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
const token = sessionStorage.getItem('token');

    try {
        console.log('orderData:', orderData);
        const response = await fetch(`${backendUrl}/orders/createOrders`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();
        console.log('Order created successfully:', data);
    } catch (error) {
        console.error('Error creating order:', error);
    }
};

export default createOrder;