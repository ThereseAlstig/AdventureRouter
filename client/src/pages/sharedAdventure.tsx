
import { useEffect, useState } from "react";
import { GetSharedAdventures } from "../api/getSharedTrips";
import { SharedTrips } from "../components/sharedTrips";

export const SharedAdventure = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
  
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
        <SharedTrips trips={trips} />
        </>
    );
}