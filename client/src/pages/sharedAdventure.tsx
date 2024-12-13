
import { useEffect, useState } from "react";
import { GetSharedAdventures } from "../api/getSharedTrips";
import { SharedTrips } from "../components/sharedTrips";
import { LoadScript } from "@react-google-maps/api";
import { fetchTripImage } from "../api/fetchImg";

export const SharedAdventure = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [tripImages, setTripImages] = useState<{ [key: number]: string | null }>({});

    const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";
    useEffect(() => {
      const loadTrips = async () => {
        try {
          const cachedTrips = localStorage.getItem('trips');
          const cachedImages = localStorage.getItem('tripImages');
    
          if (cachedTrips && cachedImages) {
            setTrips(JSON.parse(cachedTrips));
            setTripImages(JSON.parse(cachedImages));
            return;
          }
    
          const tripsData = await GetSharedAdventures();
    
          if (!tripsData) {
            throw new Error('Failed to fetch trips');
          }
    
          setTrips(tripsData);
          localStorage.setItem('trips', JSON.stringify(tripsData));
    
          const images = await Promise.all(
            tripsData.map(async (trip: any) => {
              const imageUrl = await fetchTripImage(trip.trip_id);
              return { tripId: trip.trip_id, imageUrl };
            })
          );
    
          const imageMap = images.reduce((acc, curr) => {
            acc[curr.tripId] = curr.imageUrl;
            return acc;
          }, {} as { [key: number]: string | null });
    
          setTripImages(imageMap);
          localStorage.setItem('tripImages', JSON.stringify(imageMap));
        } catch (err: any) {
          setError(err.message);
        }
      };
    
      loadTrips();
    }, []);
    
  
    if (error) {
      return <p>Error loading trips: {error}</p>;
    }



    return (
        <>
         <LoadScript googleMapsApiKey={apiKey}  onLoad={() => console.log("Google Maps API loaded successfully")}
  onError={(error) => console.error("Error loading Google Maps API", error)}>
          <div>
        <SharedTrips/>
        </div>
        </LoadScript>
        </>
    );
}