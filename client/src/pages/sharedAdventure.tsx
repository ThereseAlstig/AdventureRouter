
import { useEffect, useState } from "react";
import { GetSharedAdventures } from "../api/getSharedTrips";
import { SharedTrips } from "../components/sharedTrips";
import { LoadScript } from "@react-google-maps/api";

export const SharedAdventure = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";
    useEffect(() => {
      const loadTrips = async () => {
        try {
          const tripsData = await GetSharedAdventures();
          setTrips(tripsData);
          console.log('trips', tripsData);
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
         <LoadScript googleMapsApiKey={apiKey}>
        <SharedTrips trips={trips} />
        </LoadScript>
        </>
    );
}