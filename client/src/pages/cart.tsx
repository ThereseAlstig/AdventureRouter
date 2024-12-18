import { useEffect, useState } from "react";
import { fetchCart } from "../api/cart";
import { CartItems } from "../components/cartItems";
import { Product } from "../types/product";
import PaymentPage from "./paymentPage";
import { Links } from "../components/links";



interface ProductCart extends Product {
    product_id: any;
    quantity: number;
    cart_id: any;
}



export const Cart: React.FC = () => {
    const [products, setProducts] = useState<ProductCart[]>([]);
    const [isPaying, setIsPaying] = useState(false);

    const handleCheckout = () => {
        setIsPaying(true); 
    };

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const cart = await fetchCart(); 
                setProducts(cart); 
                console.log('Fetched cart:', cart);
            } catch (err) {
                if (err instanceof Error) {
                    console.error('Error fetching cart:', err.message);
                } else {
                    console.error('Error fetching cart:', err);
                }
            }
        };

        fetchCartItems(); 
    }, []); 

    const links1 = [
        {
            image: "/solar-cell-7097620_1280.jpg",
            alt: "Looking for adventures",
            text: "Looking for outdooor Electronics?",
            link: "/categories/3/subcategories/8"
        },
        {
            image: "/woman.png",
            alt: "hiking",
            text: "Plan your next adventure.",
            link: "/journey-planner"
        },
        {
            image: "/man.png",
            alt: "hiking",
            text: "Find your adventure essentials",
            link: "/shop"
        
        }];

        const links2 = [
            {
                image: "/adventure-1850178_1280.jpg",
                alt: "hiking",
                text: "Find your hiking essentials",
                link: "/categories/1/subcategories/2"
            },
            {
                image: "/bike-7365418_1280.jpg",
                alt: "hiking",
                text: "Top gear for cycling.",
                link: "/categories/2/subcategories/4"
            },
            {
                image: "/walk.png",
                alt: "Looking for adventures",
                text: "Looking for your next adventure?",
                link: "/shared-adventure"
             
            }];


    const cartItems = products.map((item) => ({
        productId: item.product_id, 
        quantity: item.quantity,
    }));


    return (
        <div>
          
{products.length === 0 && 
<>
<h2 className="emty-cart">Your cart is empty discover our products or plan youre next adventure!</h2>
<div className="cart-links">
  <Links links={links1} />  
</div>
 <div>
 <Links links={links2} />   
 </div>
 

</>
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