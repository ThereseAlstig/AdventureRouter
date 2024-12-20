

import { SharedTrips } from "../components/sharedTrips";
import { LoadScript } from "@react-google-maps/api";

// En sida där användare kan se delade resor
export const SharedAdventure = () => {
    const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";
   

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