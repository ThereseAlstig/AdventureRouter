export function calculateMidpointDate(startDate: string, arrivalDate: string): string {
  const start = new Date(startDate);
  const end = new Date(arrivalDate);

  // Beräkna mitten av stoppen
  const midpointTimestamp = (start.getTime() + end.getTime()) / 2;
  const midpointDate = new Date(midpointTimestamp);

  // Returnera i format YYYY-MM-DD
  return midpointDate.toISOString().split("T")[0];
}

export async function getWeather(city: string, targetDate: string) {
   
  


  const API_KEY = import.meta.env.VITE_REACT_WEATHER_API_KEY; // Din API-nyckel
    try {
      const response = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/daily?&daily&lang=en&key=${API_KEY}&city=${city}`
      );
  
      if (!response.ok) {
        throw new Error(
          `HTTP error code: ${response.status}, HTTP error message: ${response.statusText}`
        );
      }
  
      const weatherData = await response.json();

      // Filtrera väderdata för det specifika datumet
      const forecastForDate = weatherData.data.find(
        (forecast: any) => forecast.datetime === targetDate
      );
  
      if (!forecastForDate) {
        console.warn(`No weather data found for ${targetDate}`);
        return {
          cityName: weatherData.city_name,
          date: targetDate,
          description: "No forecast available",
          temperature: null,
          windSpeed: null,
          
        };
      }
  
      return {
        cityName: weatherData.city_name,
        date: forecastForDate.datetime,
        description: forecastForDate.weather.description,
        temperature: forecastForDate.temp,
        windSpeed: forecastForDate.wind_spd,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to fetch weather data:", error.message);
      } else {
        console.error("Failed to fetch weather data:", error);
      }
      return null;
    }
  }
  