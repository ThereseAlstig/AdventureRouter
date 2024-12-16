import { useEffect, useState } from "react";
import { fetchCart } from "../api/cart";
import { CartItems } from "../components/cartItems";
import { Product } from "../types/product";


interface ProductCart extends Product {
    quantity: number;
}



export const Cart: React.FC = () => {
    const [products, setProducts] = useState<ProductCart[]>([]);


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

    return (
        <div>
          
{products.length === 0 && 

<p className="emty-cart">Your cart is empty</p>

}
{products.length > 0 &&
<CartItems items={products}/>
}
            
        </div>
    );
}