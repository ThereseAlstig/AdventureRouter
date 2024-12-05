import pool from '../config/db'; // Din databasanslutning

export const getTemperatureInterval = async (temperature: number) => {
  const query = `
    SELECT id, name 
    FROM WeatherTemperatures
    WHERE min_temp <= ? AND max_temp >= ?
    LIMIT 1;
  `;
  const [rows] = await pool.query(query, [temperature, temperature]);
  return rows[0]; // Returnerar det matchade intervallet
};

export const getProductsForTemperature = async (temperatureId: number) => {
    const query = `
      SELECT p.* 
      FROM Products p
      LEFT JOIN ProductWeatherTemperature pwt ON p.id = pwt.product_id
      WHERE pwt.temperature_id = ?;
    `;
    const [rows] = await pool.query(query, [temperatureId]);
    return rows; // Returnerar produkter kopplade till temperaturintervallet
  };
  
  export const getRecommendationsByTemperature = async (temperature: number) => {
    try {
      // 1. Hämta temperaturintervallet
      const temperatureInterval = await getTemperatureInterval(temperature);
      if (!temperatureInterval) {
        throw new Error('No matching temperature interval found.');
      }
  
      // 2. Hämta produkter för temperaturintervallet
      const products = await getProductsForTemperature(temperatureInterval.id);
  
      return {
        temperatureInterval: temperatureInterval.name,
        products,
      };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error('Failed to fetch recommendations.');
    }
  };
  