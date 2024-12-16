import { Product } from "../types/product";

interface ProductCart extends Product {
    quantity: number;
}

interface CartItemsProps {
    items: ProductCart[];
}


function calculateFullprice(items: Product[]) {
    let fullPrice = 0;
    items.forEach((item) => {
        fullPrice += Number(item.price);
    });
    return fullPrice;
    
}

export const CartItems = (items: CartItemsProps) => {
console.log(items, 'items');

    return (
        <div>
            <h1 className="youre-cart">Youre cart:</h1>
            <ul className="cart-items">
                {items.items.map((item) => (
                    <li key={item.id}>
                        <img src={item.image_url} alt={item.name} />
                        <h2>{item.name}</h2>
                        
                        <p>{item.description}</p>
                        
                        <p>Quantity: {item.quantity}</p>
                        <p> Price: {item.price} kr</p>
                    </li>
                ))}
            </ul>
            <h2 className="total">Total price: {calculateFullprice(items.items)} kr</h2>
        </div>
    )
}