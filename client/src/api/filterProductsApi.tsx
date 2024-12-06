export async function  getFilteredProducts(weatherData?: any, mode?: any) {
    const website = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  
    const filters: any = {};

  if (weatherData?.temperature) {
    filters.temperature = getTemperatureCategory(weatherData.temperature);
  }

  if (weatherData?.description) {
    filters.weather = getWeatherCategory(weatherData.description);
  }

  if (mode) {
    filters.travelOptionName = mode;
  }

  console.log("Filters skickade till API:", filters);
  console.log('mpde', mode);

  const params = new URLSearchParams(filters);
    try{
        const response = await fetch(`${website}/products/filtered?${params.toString()}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.ok){
            const data = await response.json();
            const uniqueProducts = data.filter(
                (product: any, index: number, self: any[]) =>
                    index === self.findIndex((p) => p.id === product.id)
            );
        
            console.log("Filtered products (unique):", uniqueProducts);
            return uniqueProducts;
        }
    } catch(error){
        console.error('Failed to fetch products:', error);
        throw new Error('Failed to fetch products');
    }






}

function getTemperatureCategory(temperature: number) {
    if (temperature < -10) {
        return 'Extremely cold';
    } else if (temperature >= -10 && temperature < 0) {
        return 'Very cold';
    } else if (temperature >= 0 && temperature < 10) {
        return 'Cold';
    } else if (temperature >= 10 && temperature < 20) {
        return 'Warm';
    } else if (temperature >= 20 && temperature < 30) {
        return 'Very warmly';
    } else {
        return 'Very hot';
    }
}

function getWeatherCategory(description: string) {
    if (description.toLowerCase().includes('cloud')) {
        return 'cloudy'; // Matchar din databaskategori för snö
    } else if (description.toLowerCase().includes('rain')) {
        return 'reign'; // Matchar regn
    }else if(description.toLowerCase().includes('snow')){
        return 'reign'; // Matchar snö      {
    } else if (description.toLowerCase().includes('clear') || description.toLowerCase().includes('sun')) {
        return 'sunny'; // Matchar sol
    } else {
        return 'cloudy'; // Standardkategori
    }
}

