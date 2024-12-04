import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";

interface MapWithDirectionsProps {
  start: google.maps.LatLng | string;
  destination: google.maps.LatLng | string;
  waypoints: google.maps.DirectionsWaypoint[];
  mode: google.maps.TravelMode;
}

const MapWithDirections: React.FC<MapWithDirectionsProps> = ({ start, destination, waypoints, mode }) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";

  useEffect(() => {
    const fetchDirections = async () => {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: destination,
          waypoints: waypoints.map((wp) => ({ location: wp, stopover: true } as google.maps.DirectionsWaypoint)),
          travelMode: mode,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    };

    fetchDirections();
  }, [start, destination, waypoints, mode]);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
        center={{ lat: 59.3293, lng: 18.0686 }}
        zoom={8}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithDirections;
