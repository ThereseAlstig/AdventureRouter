import React, { useEffect, useState } from 'react';


export const Admin = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    travel_option_id: [],
    image_url: '',
    in_stock: true,
    productCategories: [],
    weather_temperature_id: [],
    weather_ids: [],
  });


interface WeatherTemperature {
  id: number;
  name: string;
}

interface WeatherOption {
    id: number;
    name: string;
  }
  interface TravelOption {
    id: number;
    name: string;
  }
  
  interface Category {
    id: number;
    name: string;
  }
  

  const [categories, setCategories] = useState<Category[]>([]);
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);
  const [weatherTemperatures, setWeatherTemperatures] = useState<WeatherTemperature[]>([]);
  const [weatherOptions, setWeatherOptions] = useState<WeatherOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const categoriesResponse = await fetch('http://localhost:3000/products/categoriesTwo');
      const travelOptionsResponse = await fetch('http://localhost:3000/products/travel-options');
      const weatherTemperaturesResponse = await fetch('http://localhost:3000/products/weather-temperatures');
      const weatherOptionsResponse = await fetch('http://localhost:3000/products/weather-options');

      setCategories(await categoriesResponse.json());
      setTravelOptions(await travelOptionsResponse.json());
      setWeatherTemperatures(await weatherTemperaturesResponse.json());
      setWeatherOptions(await weatherOptionsResponse.json());
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setProductData((prevData) => ({
      ...prevData,
      [name]: e.target instanceof HTMLSelectElement ? (value ? parseInt(value, 10) : null) : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, key: string) => {
    const selectedValues = Array.from(e.target.selectedOptions).map((option) => parseInt(option.value, 10));
    setProductData((prevData) => ({
      ...prevData,
      [key]: selectedValues,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Product added successfully!');
        setProductData({
          name: '',
          price: '',
          description: '',
          travel_option_id: [],
          image_url: '',
          in_stock: true,
          productCategories: [],
          weather_temperature_id: [],
          weather_ids: [],
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error submitting product:', err);
      alert('Failed to submit product');
    }
  };

  return (
  
    <div className='center'>
    
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Travel Option ID:</label>
          <select  multiple  name="travel_option_id"
    onChange={handleChange}>
        {travelOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image_url"
            value={productData.image_url}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            In Stock:
            <input
              type="checkbox"
              name="in_stock"
              checked={productData.in_stock}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
        <div>
          <label>Categories (comma-separated):</label>
          <select  multiple onChange={(e) => handleSelectChange(e, 'productCategories')}>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
        </div>
        <div>
          <label>Temperatures (comma-separated):</label>
          <select  multiple onChange={(e) => handleSelectChange(e, 'weather_temperature_id')}>
        {weatherTemperatures.map((temp) => (
          <option key={temp.id} value={temp.id}>
            {temp.name}
          </option>
        ))}
      </select>
        </div>
        <div>
          <label>Weathers (comma-separated):</label>
          <select  multiple onChange={(e) => handleSelectChange(e, 'weather_ids')}>
        {weatherOptions.map((weather) => (
          <option key={weather.id} value={weather.id}>
            {weather.name}
          </option>
        ))}
      </select>
        </div>
        <button type="submit">Add Product</button>
      </form>

      
    </div>
  );
};

