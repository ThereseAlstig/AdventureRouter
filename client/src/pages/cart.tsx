import { useEffect, useState } from "react";
import { fetchCart } from "../api/cart";
import { CartItems } from "../components/cartItems";
import { Product } from "../types/product";
import PaymentPage from "./paymentPage";


interface ProductCart extends Product {
    product_id: any;
    quantity: number;
}



export const Cart: React.FC = () => {
    const [products, setProducts] = useState<ProductCart[]>([]);
    const [isPaying, setIsPaying] = useState(false);

    const handleCheckout = () => {
        setIsPaying(true); // Visa betalningssidan
    };

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const cart = await fetchCart(); // Hämta produkterna
                setProducts(cart); // Uppdatera state med produkterna
                console.log('Fetched cart:', cart);
            } catch (err) {
                if (err instanceof Error) {
                    console.error('Error fetching cart:', err.message);
                } else {
                    console.error('Error fetching cart:', err);
                }
            }
        };

        fetchCartItems(); // Kör funktionen
    }, []); // Kör endast vid första renderingen


    const cartItems = products.map((item) => ({
        productId: item.product_id, // Konvertera till string om det är ett nummer
        quantity: item.quantity,
    }));


    return (
        <div>
          
{products.length === 0 && 

<p className="emty-cart">Your cart is empty</p>

}
{products.length > 0 &&
<CartItems items={products}/>
}
{!isPaying ? (<div className="checkout">
                <button onClick={handleCheckout}>Go to Payment</button>
                </div>
            ) : (
                <div className="payment">
                <PaymentPage items={cartItems}/>
                </div>
            )}
        </div>
    );
}