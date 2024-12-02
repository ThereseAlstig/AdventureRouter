import { useEffect, useState } from "react";
import { Product } from "../types/product"; // Adjust the import path as necessary
import { ProductCarusell } from "../components/productCarusell";
import { Navigation } from "../layouts/navigation"
import { useParams } from "react-router-dom";

export const CategoryPage = () => {


    const { categoryId } = useParams<{ categoryId: string }>(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (!categoryId) {
            console.warn("Category ID is undefined or not available yet");
            return;
        }
        console.log('categoir', categoryId);
        const fetchFilteredProducts = async () => {
            try {

                
                const response = await fetch(
                    `http://localhost:3000/products/filtered?categoryOne=${categoryId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data: Product[] = await response.json();
                console.log("Fetched products:", data);
                const uniqueProducts = data.filter(
                    (product, index, self) =>
                        index === self.findIndex((p) => p.id === product.id)
                );
                setProducts(uniqueProducts);
                console.log('produkter', products)
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

      
            fetchFilteredProducts(); // Kör GET-begäran om categoryOne finns
        
    }, [categoryId]);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }




    return (

        <>
        <Navigation/>
        <ProductCarusell products={products}/>
        </>
        
    );
}