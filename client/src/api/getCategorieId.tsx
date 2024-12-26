//Hämtar id för kategorierna, inför att länka till rätt kategorisidor
export const GetCategoryId = async (categoryOne: string, categoryTwo: string) => {

    const website = import.meta.env.VITE_REACT_APP_BACKEND_URL;
   
    try {
        const response = await fetch(`${website}/products/categoryId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryOne, categoryTwo }),
        });

        if (!response.ok) {
            const errorMessage = await response.text(); 
            throw new Error(`Failed to fetch id: ${errorMessage}`);
        }

        const data = await response.json(); 
      
        return data;
    } catch (error) {
        console.error('Error fetching id:', error); 
        throw error; 
    }
};