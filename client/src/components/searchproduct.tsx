
import { useState } from "react";
import { Product } from "../types/product";


export const AdminSearch = () => {
const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;


const [product, setProduct] = useState<Product | null>(null);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    handleSearch(searchQuery); // Anropa funktionen med sökfrågan
  };

    const handleSearch = async (searchQuery: string) => {
        try {
          setProduct(null); // Nollställ tidigare sökresultat
          // Hämta token från sessionStorage eller localStorage
          const token = sessionStorage.getItem('token');
      
          if (!token) {
            alert('You must be logged in to perform this action.');
            return;
          }
      
          // Skicka förfrågan till backend med token i Authorization-headern
          const response = await fetch(`${backendUrl}/products/search?name=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, 
            },
          });
      
          if (response.ok) {
            const result = await response.json();
            const product = Array.isArray(result) && result.length > 0 ? result[0] : result;

            setProduct(product);
          
            // Gör något med sökresultaten, t.ex. uppdatera en state
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (err) {
          console.error('Error performing search:', err);
          alert('Failed to perform search');
        }
      };


      //ändra lagerstatus
      const handleStockChange = async (inStock: boolean, productId: number) => {
        try {

          
            const token = sessionStorage.getItem('token');
      
          if (!token) {
            alert('You must be logged in as an admin to perform this action.');
            return;
          }
 
          const response = await fetch(`${backendUrl}/products/uppdate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Lägg till token
            },
            body: JSON.stringify({ in_stock: inStock, productId: productId }), // Skicka uppdaterat värde
          });
      
          if (response.ok) {
            alert('Stock status updated successfully!');

            setProduct((prevProduct) =>
                prevProduct ? { ...prevProduct, in_stock: inStock } : null
              ); // Uppdatera bara in_stock lokalt
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (err) {
          console.error('Error updating stock status:', err);
          alert('Failed to update stock status.');
        }
      };


    return (
        <div className="center admin">
          
            <label>Search product:
            </label>
            <input type="text" placeholder="Search product" onChange={handleInputChange} />

     {product && (
                <div key={product.id} className="searchedproduct">
                    <h2>{product.name}</h2>
                    <div className="adminproduct">
                    <p>{product.description}</p>
                    <img className="img" src={product.image_url} alt={product.name} />  </div>
                    <p>{product.price} kr</p>
                    <div className="checkbox">
        <label>
      <input
        type="checkbox"
        checked={product.in_stock}
        onChange={() => handleStockChange(!product.in_stock, product.id)} // Hantera ändring
      />
      In stock
    </label></div>
                    
                   </div> 
            )}
                    
        </div>
    )
}