import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

interface MapWithDirectionsProps {
  start: google.maps.LatLng | string;
  destination: google.maps.LatLng | string;
  waypoints: google.maps.DirectionsWaypoint[];
  mode: google.maps.TravelMode;
}

//Hämtar kartorna för att visa vägbeskrivning
const MapWithDirections: React.FC<MapWithDirectionsProps> = ({ start, destination, waypoints, mode }) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const[distance, setDistance] = useState<string | null>(null);
  const[duration, setDuration] = useState<string | null>(null);


  //Gör om mode till google.maps.TravelMode för att passa Google MAps API
  const mapMode = (mode: string): { travelMode: google.maps.TravelMode; filterMode: string } => {
    const modeLower = mode.toLowerCase();
  
    switch (modeLower) {
      case "motorcycle":
        return { travelMode: google.maps.TravelMode.DRIVING, filterMode: "motorcycle" };
      case "car":
        return { travelMode: google.maps.TravelMode.DRIVING, filterMode: "car" };
      case "bicycle":
        return { travelMode: google.maps.TravelMode.BICYCLING, filterMode: "bicycle" };
      case "train":
        return { travelMode: google.maps.TravelMode.TRANSIT, filterMode: "train" };
      case "bus":
        return { travelMode: google.maps.TravelMode.TRANSIT, filterMode: "bus" };
      case "hike":
        return { travelMode: google.maps.TravelMode.WALKING, filterMode: "hike" };
      default:
        throw new Error(`Invalid mode: ${mode}`);
    }
  };


  useEffect(() => {
    const fetchDirections = async () => {
     const travelOption =  mapMode(mode);

     const formattedWaypoints = waypoints.map((wp) => {
      // Korrigera extra kapsling om det finns
      const location = typeof wp.location === "string" ? wp.location : wp.location;
  return {
    location,
    stopover: true,
  };
    });
    
    //Kollar stopp längst vägen
     const hasWaypoints = formattedWaypoints && formattedWaypoints.length > 0;
      if(travelOption.travelMode){
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: destination,
          waypoints: hasWaypoints ? formattedWaypoints : undefined,
          travelMode: travelOption.travelMode,
          
        },
        (result, status) => {
          if (status === "OK") {
       
            setDirections(result);
      if (result && result.routes.length > 0 && result.routes[0].legs.length > 0) {
        const leg = result.routes[0].legs[0];
        setDistance(leg.distance ? leg.distance.text : "No distance available");
        setDuration(leg.duration ? leg.duration.text : "No duration available");
          } else {
            console.error("Directions request failed:", status);
          }
        }
      }
      );
    }
  }
    fetchDirections();
  }, [start, destination, waypoints, mode]);

  return (
   <div className="google-container">
   
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
        center={{ lat: 59.3293, lng: 18.0686 }}
        zoom={8}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
  
     {distance && duration && (
      <div>
        <p>Distance: {distance}</p>
        <p>Estimated Time: {duration}</p>
      </div>
     )}
      </div>
  );
};

export default MapWithDirections;
