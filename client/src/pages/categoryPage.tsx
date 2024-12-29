import { useEffect, useState } from "react";
import { Product } from "../types/product"; // Adjust the import path as necessary
import { ProductCarusell } from "../components/productCarusell";
import { useParams } from "react-router-dom";

export const CategoryPage = () => {


    const { categoryId } = useParams<{ categoryId: string }>(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    //Hämtar produkter från kategorin
    useEffect(() => {
        if (!categoryId) {
            console.warn("Category ID is undefined or not available yet");
            return;
        }
  
        const fetchFilteredProducts = async () => {
            try {

                const key = import.meta.env.VITE_REACT_APP_BACKEND_URL;
               
                const response = await fetch(
                    `${key}/products/filtered?categoryOne=${categoryId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data: Product[] = await response.json();
              
                const uniqueProducts = data.filter(
                    (product, index, self) =>
                        index === self.findIndex((p) => p.id === product.id)
                );
                setProducts(uniqueProducts);
          
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

      
            fetchFilteredProducts(); 
        
    }, [categoryId]);


    if (error) {
        return <p>Error: {error}</p>;
    }




    return (
<>
        {loading ? (
            <div className="skeleton-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="skeleton"></div>
              ))}
            </div>
          ) : (
            <ProductCarusell products={products} />
          )}
          <div className="homepageWords">
            <h2>Adventure Awaits: Discover the Gear and Guidance for Your Next Big Journey.</h2>
          </div>
        </>
        
    );
}