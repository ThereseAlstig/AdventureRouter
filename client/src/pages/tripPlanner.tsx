import { useEffect, useState, useRef } from "react";
import TripPlannerForm from "../components/tripPlannerForm";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { getWeather } from "../api/weatherApi"; // Din väderfunktion

export const TripPlanner = () => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [tripWeather, setTripWeather] = useState<any>(null);
  const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";
  const [places, setPlaces] = useState<any[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
const [duration, setDuration] = useState<string | null>(null);
  const fetchNearbyPlaces = (location: google.maps.LatLng) => {
    if (!mapRef.current) return;

    const service = new google.maps.places.PlacesService(mapRef.current);

    const request = {
      location,
      radius: 5000, // 5 km
      type: "lodging", // Hotell
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaces(results);
      } else {
        console.error("PlacesService error: ", status);
      }
    });
  };

  useEffect(() => {
    if (directions && directions.routes.length > 0) {
      const route = directions.routes[0];
      const midpoint = route.overview_path[Math.floor(route.overview_path.length / 2)];
      fetchNearbyPlaces(new google.maps.LatLng(midpoint.lat(), midpoint.lng()));
    }
  }, [directions]);

  const handleSubmit = async ({
    start,
    destination,
    waypointList,
    startDate,
    arrivalDate,
    mode,
  }: {
    start: string;
    destination: string;
    waypointList: string[];
    startDate: string;
    arrivalDate: string;
    mode: google.maps.TravelMode;
  }) => {
    if (!start || !destination) {
      alert("Start and destination are required.");
      return;
    }

    try {
      // Hämta väder för start och destination
      const startWeather = await getWeather(start, startDate);
      const destinationWeather = await getWeather(destination, arrivalDate);

      // Hämta väder för mittenpunkt om det finns waypoints
      const midpoint =
        waypointList.length > 0
          ? waypointList[Math.floor(waypointList.length / 2)]
          : null;
      const midpointDate = midpoint ? startDate : null;
      const midpointWeather = midpoint
        ? await getWeather(midpoint, midpointDate as string)
        : null;

      setTripWeather({
        start: startWeather,
        destination: destinationWeather,
        midpoint: midpointWeather,
      });

      // Hämta rutt från Google Maps
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: destination,
          waypoints: waypointList.map((wp) => ({ location: wp, stopover: true })),
          travelMode: mode,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
      if (result && result.routes.length > 0 && result.routes[0].legs.length > 0) {
        const leg = result.routes[0].legs[0];
        setDistance(leg.distance ? leg.distance.text : "N/A");
        setDuration(leg.duration ? leg.duration.text : "N/A");
      } else {
        alert("No routes found.");
      }
          } else {
            alert("Could not fetch directions: " + status);
          }
        }
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h1>Trip Planner</h1>
      <TripPlannerForm onSubmit={handleSubmit} />
      <LoadScript googleMapsApiKey={apiKey} language="en">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "500px" }}
          center={{ lat: 59.3293, lng: 18.0686 }} // Default center: Stockholm
          zoom={8}
        >
          {directions && <DirectionsRenderer directions={directions} />}
          {places.map((place, index) => (
            <Marker
              key={index}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }}
              title={place.name}
            />
          ))}
        </GoogleMap>


      </LoadScript>        
      {distance && duration && (
  <div>
    <p>Distance: {distance}</p>
    <p>Estimated Time: {duration}</p>
  </div>
)}
      {tripWeather && (
        <div>
          <h2>Weather Information</h2>
          <p>Start: {tripWeather.start?.description || "N/A"}</p>
          <p>Destination: {tripWeather.destination?.description || "N/A"}</p>
          {tripWeather.midpoint && (
            <p>Midpoint: {tripWeather.midpoint?.description || "N/A"}</p>
          )}
        </div>
      )}
    </div>
  );
};


