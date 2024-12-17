
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

export const Navigation = () => {



        interface Category {
            id: number;
            name: string;
            subcategories?: Category[];
        }

        const [categories, setCategories] = useState<Category[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [openCategory, setOpenCategory] = useState<number | null>(null);
        const { categoryId} = useParams<{ categoryId: string; subcategoryId?:string }>();
        // Hämta alla kategorier när komponenten laddas

      
    
        
        
        useEffect(() => {
            const fetchCategories = async () => {
                try {

                   
                    const key = import.meta.env.VITE_REACT_APP_BACKEND_URL;
                    console.log(key);
                    // Hämtar huvudkategorier och underkategorier
                    const response = await fetch(`${key}/products/categories`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setCategories(data);
                    setLoading(false);

                    if (categoryId) {
                        setOpenCategory(parseInt(categoryId, 10));
                    }
                } catch (error) {
                    setError((error as any).message);
                    setLoading(false);
                }
            };
    
            fetchCategories();
        }, []); // Tom array, för att köra fetch en gång när komponenten renderas
    
        if (loading) {
            return <p>Loading categories...</p>;
        }
    
        if (error) {
            return <p>Error: {error}</p>;
        }

        const toggleSubcategories = (categoryId: number) => {
            setOpenCategory(openCategory === categoryId ? null : categoryId);
        };
    
        return (
            <nav className="navigation">
               {categories.map((category) => (
                <div key={category.id}>
                       <h3 onClick={() => toggleSubcategories(category.id)}> 
                        <NavLink to={`/categories/${category.id}`} className={({ isActive }) => (isActive ? "active" : "")}>
                            {category.name}
                        </NavLink></h3>
                    {openCategory === category.id && (
                        <ul>
                            {category.subcategories && category.subcategories.length > 0 ? (
                                category.subcategories.map((subcategory) => (
                                    <li key={subcategory.id}> 
                                    <NavLink to={`/categories/${category.id}/subcategories/${subcategory.id}`}
                                    className={({ isActive }) => (isActive ? "active subcategory" : "subcategory")} aria-label="navigate to categorie">
                                    {subcategory.name}
                                </NavLink></li>
                                ))
                            ) : (
                                <li>No subcategories available</li>
                            )}
                        </ul>
                    )}
                </div>
            ))}
            </nav>
        );
    };
    

    

