import getOrCreateCartId from "../functions/CreateCartId";
//Sparar produkter i kundkorgen
export const saveToCart = async (productId: number, quantity: number) => {
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    try {
       
        const email = sessionStorage.getItem('userEmail');
       
        const cartId = email ? null : getOrCreateCartId();

        const requestBody = {
            productId,
            quantity,
            ...(email ? { email } : { cartId }), // Skicka email om det finns, annars cartId
        };

        // Skicka förfrågan till backend
        const response = await fetch(`${backendUrl}/orders/createCart`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Kontrollera om förfrågan lyckades
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.cart; // Returnera den uppdaterade kundkorgen
    } catch (error) {
        if (error instanceof Error) {
            console.error('Kunde inte spara produkten i kundkorgen:', error.message);
        } else {
            console.error('Kunde inte spara produkten i kundkorgen:', error);
        }
        throw error;
    }
};

export const fetchCart = async () => {
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
    const email = sessionStorage.getItem('userEmail'); 
    const cartId = sessionStorage.getItem('cartId');
    try {

        if (!email && !cartId) {
            throw new Error('Neither email nor cartId is available in frontend');
        }
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (cartId) params.append('cartId', cartId);

      
        const response = await fetch(`${backendUrl}/orders/fetchCart?${params.toString()}`, {
            method: "GET",
        });

        // Kontrollera om förfrågan lyckades
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
      
        return data.cartItems; // Returnera kundkorgen
    } catch (error) {
        if (error instanceof Error) {
            console.error('Kunde inte hämta kundkorgen:', error.message);
        } else {
            console.error('Kunde inte hämta kundkorgen:', error);
        }
        throw error;
    }
};