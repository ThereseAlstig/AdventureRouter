import { useEffect, useState } from "react"
import { GetProduct } from "../api/getProduct";
import { useParams } from "react-router-dom";
import { Product } from "../types/product";
import { Link } from "react-router-dom";
import { saveToCart } from "../api/cart";
import { GetCategoryId } from "../api/getCategorieId";


//sida för enskild produkt
export const ProductPage = () => {
const [product, setProduct] = useState<Product | null>(null);
const { id } = useParams();
const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
const [categoryIds, setCategoryIds] = useState<{ categoryOneId: number, categoryTwoId: number } | null>(null);


//Hämtar produkten
    useEffect(() => {
        const fetchProducts = async () => {
            try {
            if (id) {
                const data = await GetProduct(id);
                setProduct(data);
                
                try {

                    //hämtar kategori id
                    const categoryIds = await GetCategoryId(data.category_one_name, data.category_two_name); 
                    setCategoryIds(categoryIds)
                    
                } catch (error) {
                    console.error('Error fetching category IDs:', error);
                }
            }
            } catch (error) {
                console.error(error);
            }
         
        }
        fetchProducts();
    }, []);

    //Hantera antal i kundvagnen
    const handleQuantityChange = (productId: number, quantity: string) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: parseInt(quantity) || 1, // Standard till 1 om input är tomt
        }));
    };
    
    //Lägg till i kundvagnen
    const handleAddToCart = async (productId: number) => {
        const quantity = quantities[productId] || 1; // Hämta a/ Hämta antal från state (standard till 1)
        try {
            const updatedCart = await saveToCart(productId, quantity);
            console.log("Uppdaterad kundkorg:", updatedCart);
            alert("Produkten lades till i kundkorgen!");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Kunde inte lägga till produkten:", error.message);
            } else {
                console.error("Kunde inte lägga till produkten:", error);
            }
            alert("Något gick fel!");
        }
    };

    return (
        <div className="product-page">
            <div className="product-content">
                <div className="product-text">
                    {categoryIds && ( 
                     <div className="product-categories">
                        <Link to={`/categories/${categoryIds?.categoryOneId}`}>{product?.category_one_name}</Link>
                        <Link to={`/categories/${categoryIds?.categoryOneId}/subcategories/${categoryIds?.categoryTwoId}`}>{product?.category_two_name}</Link>
                    </div>  ) }
                    
                    <h1>{product?.name}</h1>
                    <p>{product?.description}</p>
                    <p>{product?.price}</p>
                {product && (
                  <div className="quantity-container">
                    <label htmlFor={`quantity-${product.id}`}>Antal:</label>
                    <input
                      id={`quantity-${product.id}`}
                      type="number"
                      min="1"
                      defaultValue="1"
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)} // Hantera antal
                    />
                  </div>
                )}
                    <button className="button-cart"
      onClick={() => product?.id && handleAddToCart(product.id)} >PUT IN CART</button>
                </div>
                <div className="product-image">
                    <img className="product-img" src={product?.image_url} alt={product?.name} />
                </div>
            </div>
        </div>
    
    )
}


