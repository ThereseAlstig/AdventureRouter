export const GetProduct = async (id: string) => {

    const website = import.meta.env.VITE_REACT_APP_BACKEND_URL;
    const response = await fetch(`${website}/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    const data =  response.json();
    return data;
}