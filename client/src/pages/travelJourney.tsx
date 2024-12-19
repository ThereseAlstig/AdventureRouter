import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetSingelTrips } from "../api/getSingelTrip";
import { LoadScript } from "@react-google-maps/api";
import MapWithDirections from "../api/googleMapsApi";
import { fetchTripImage } from "../api/fetchImg";
import { ProductCarusellTips } from "../components/productCarusellTips";
import { getFilteredProducts } from "../api/filterProductsApi";

export const TragvelJourney = () => {

const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY || "YOUR  API KEY";


    const { id } = useParams(); 
    const [trip, setTrip] = useState<any>();
    const [error, setError] = useState(null);
    const [tripImages, setTripImages] = useState<{ [key: number]: string | null }>({});
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);


 console.log(id);
    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
               
                const tripData = await GetSingelTrips(Number(id));
                setTrip(tripData);
                console.log(tripData);

                const imageUrl = await fetchTripImage(Number(id));

const imageMap = { [Number(id)]: imageUrl };

              
                       
                             setTripImages(imageMap);
                             const startWeather = tripData.start_weather;
                             const modeTravel = tripData.travel_mode;

                               const products = await getFilteredProducts(startWeather, modeTravel);
                                   setFilteredProducts(products); 
            } catch (error) {
                setError((error as any).message);
            }
        };

        if (id) {
            fetchTripDetails();
        }
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!trip) {
        return <div>Loading...</div>;
    }

    function formatDateToReadable(dateString: string): string {
        const date = new Date(dateString);
    
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date string");
        }
    
        const day = date.getDate();
        const year = date.getFullYear();
        const month = date.toLocaleString("en-US", { month: "long" });
    
        function getDaySuffix(day: number): string {
          if (day >= 11 && day <= 13) return "th";
          switch (day % 10) {
            case 1:
              return "st";
            case 2:
              return "nd";
            case 3:
              return "rd";
            default:
              return "th";
          }
        }
    
        const daySuffix = getDaySuffix(day);
        return `the ${day}${daySuffix} of ${month} ${year}`;
      }
    

    return (
        <div className="trip-details-container">
                     <LoadScript googleMapsApiKey={apiKey}  onLoad={() => console.log("Google Maps API loaded successfully")}
  onError={(error) => console.error("Error loading Google Maps API", error)}>
          <div className="trip-details11">
        <h1>{trip.title}</h1>

        <div className="trip-details-singel-page1">
                <p>
                  From {trip.start_city} to {trip.end_city}
                </p>
                {trip.stops.length > 0 && (
                  <>
                    <p>Stopping in </p>
                    <p>
                      {trip.stops
                        .map((stop: { city_name: string }) => stop.city_name)
                        .join(" and ")}
                    </p>
                  </>
                )}
                <p>Traveling by {trip.travel_mode}.</p>
              </div>
  
              <div className="trip-details-singel-page2">
                <p>
                  My adventure lasted from{" "}
                  {formatDateToReadable(trip.start_date)} to{" "}
                  {formatDateToReadable(trip.end_date)}.
                </p>
              </div>
              {trip.best_experience? (
                <div className="trips-singel-best">
                  <h2>Best:</h2>
                  <p>{trip.best_experience}</p>
                
                </div>
              ) : null}
              {trip.worst_experience? (
                <div className="trips-singel-worst">
                    <h2>Worst:</h2>
                    <p>{trip.worst_experience}</p>
                </div>
                ) : null}
           
        
  <div className="trip-details-singel-page">
        {tripImages[trip.trip_id] && tripImages[trip.trip_id] !== "Image for trip null" ? (
        <img
            src={tripImages[trip.trip_id]!} // Endast om URL finns och inte är "null"
            alt={`Image for trip ${trip.title}`}
            loading="lazy"
            width="200"
        />
    ) : (
        <p></p> // Fallback när ingen bild finns    
        )}

<div className="weather-forecast">
          <h2>Weather forecast:</h2>
          {trip.start_weather && (
            <div>
          <h3>{trip.start_city}</h3>
            <p>Temperature: {trip.start_weather.temperature}°C, Wind speed: {trip.start_weather.wind_speed}, {trip.start_weather.description}</p>
          </div>)}
          {trip.end_weather && (
            <div>
              <h3>{trip.end_city}</h3>
              <p>Temperature: {trip.end_weather.temperature}°C, Wind speed: {trip.end_weather.wind_speed}, {trip.end_weather.description}</p>
          <p></p>
          </div>)}
              </div>
        </div></div>

        <div className="trip-details-singel-page3">
       <MapWithDirections
              start={trip.start_city}
              destination={trip.end_city}
              waypoints={trip.stops.map((stop: { city_name: string }) => ({
                location: stop.city_name,
                
              }))}
              mode={trip.travel_mode.toUpperCase() as google.maps.TravelMode}
            />
       
       
         <div className= "tips_trips">
                 <ProductCarusellTips products={filteredProducts} />
                 </div>
        </div></LoadScript></div> 
    );
};