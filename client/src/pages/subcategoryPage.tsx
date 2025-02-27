import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../types/product";
import { ProductCarusell } from "../components/productCarusell";


//Sida för underkategori
export const SubcategoryPage = () => {


    const { subcategoryId } = useParams<{ subcategoryId: string }>(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);


    //Hämtar produkter från underkategorin
    useEffect(() => {
        if (!subcategoryId) {
            console.warn("Category ID is undefined or not available yet");
            return;
        }
       
        const fetchFilteredProducts = async () => {
            try {
                const key = import.meta.env.VITE_REACT_APP_BACKEND_URL;
              
                
                const response = await fetch(
                    `${key}/products/filtered?categoryTwo=${subcategoryId}`
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
        
    }, [subcategoryId]);

   

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
};