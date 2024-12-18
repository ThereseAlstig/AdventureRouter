import { useEffect } from "react";
import updateCart from "../api/updateCart";
import { Product } from "../types/product";

interface ProductCart extends Product {
    cart_id: any;
    product_id:  null | undefined;
    quantity: number;
}

interface CartItemsProps {
    items: ProductCart[];
}


function calculateFullprice(items: { price: number; quantity: number }[]) {
    let fullPrice = 0;
    items.forEach((item) => {
        fullPrice += Number(item.price)  * item.quantity;;
    });
    return fullPrice;
    
}




export const CartItems = (items: CartItemsProps) => {
console.log(items, 'items');

useEffect(() => {
    const savedPosition = localStorage.getItem("scrollPosition");
    if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
        localStorage.removeItem("scrollPosition"); // Ta bort efter användning
    }
}, []);

const handleQuantityChange = async (productId: number, newQuantity: number) => {
    const cartId = items.items[0].cart_id;
    if (newQuantity < 1) {
        // Om mängden är mindre än 1, ta bort produkten
        await updateCart(cartId, productId, 0);
    } else {
        // Annars uppdatera mängden
        await updateCart(cartId, productId, newQuantity);
    }
    localStorage.setItem("scrollPosition", window.scrollY.toString());

    // Ladda om sidan
    window.location.reload();
};

    return (
        <div>
            <h1 className="youre-cart">Youre cart:</h1>
            <ul className="cart-items">
                {items.items.map((item) => (
                    <li key={item.product_id}>
                        <img src={item.image_url} alt={item.name} />
                        <h2>{item.name}</h2>
                        
                        <p>{item.description}</p>
                        
                        <label>
                            Quantity:
                            <input
                                type="number"
                                min="0"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleQuantityChange(
                                        item.product_id!,
                                        Number(e.target.value)
                                    )
                                }
                            />
                        </label>
                        <p> Price: {item.price} kr</p>
                    </li>
                ))}
            </ul>
            <h2 className="total">Total price: {calculateFullprice(items.items)} kr</h2>
        </div>
    )
}