import React, { useEffect, useState } from "react";


interface FormProps {
  onSubmit: (data: {
    start: string;
    destination: string;
    waypointList: string[];
    startDate: string;
    arrivalDate: string;
    mode: google.maps.TravelMode;
    modeTravel: string;
  }) => void;
}

const TripPlannerForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState("");
  const [startDate, setStartDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [mode, setMode] = useState<string>("car");
  interface TravelOption {
    id: string;
    name: string;
  }
  
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);


  
  useEffect(() => {
    async function fetchTravelOptions() {
      try {
        const website = import.meta.env.VITE_REACT_APP_BACKEND_URL;
        const response = await fetch(`${website}/products/travel-options`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTravelOptions(data);
          console.log(travelOptions);
        }
      } catch (error) {
        console.error('Failed to fetch travel options:', error);
        throw new Error('Failed to fetch travel options');
      }
    };
    fetchTravelOptions();
  }, []);

  //Filterar ut vilken mode som ska användas, beroende på om de tär för google map eller filtrera produkter
  const mapMode = (mode: string): { travelMode: google.maps.TravelMode; filterMode: string } => {
    const modeLower = mode.toLowerCase();
  
    switch (modeLower) {
      case "motorcycle":
        return { travelMode: google.maps.TravelMode.DRIVING, filterMode: "motorcycle" };
      case "car":
        return { travelMode: google.maps.TravelMode.DRIVING, filterMode: "car" };
      case "moped":
        return { travelMode: google.maps.TravelMode.DRIVING, filterMode: "moped" };
      case "cykle":
        return { travelMode: google.maps.TravelMode.BICYCLING, filterMode: "cykle" };
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



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const waypointList = waypoints
      ? waypoints.split(",").map((wp) => wp.trim())
      : [];
      const {travelMode, filterMode} = mapMode(mode); // Mappa direkt här
     
    

    onSubmit({
      start,
      destination,
      waypointList,
      startDate,
      arrivalDate,
      mode: travelMode,
      modeTravel: filterMode// Typkonvertering här
    });
   
  };

  return (
    <form onSubmit={handleSubmit} className="tripPlanerForm__input">
        <div className="tripPlanerForm__row">
      <label>
        Start:
        </label><input
          type="text"
          aria-label="start location"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Start location"
        />
      
      </div>

      <div className="tripPlanerForm__row">
      <label>
        Destination:</label>
        <input
          type="text"
          aria-label="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
        />
      </div>
      <div className="tripPlanerForm__row tripPlanerForm__row--wide">
      <label>
        Waypoints:</label>
        <div className="tripPlanerForm__inputWrapper">
        <input
          type="text"
          aria-label="optional waypoints"
          value={waypoints}
          onChange={(e) => setWaypoints(e.target.value)}
          placeholder="Optional waypoints"
        />
        <p>(optional, separated by commas)</p>
        </div>
      </div>
      <div className="tripPlanerForm__row">
      <label>
        Start Date: </label>
        <input
          type="date"
          aria-label="departure date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
     </div>
     <div className="tripPlanerForm__row">
      <label>
        Arrival Date:</label>
        <input
          type="date"
          aria-label="arrival date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
        />
      </div>

      <div className="tripPlanerForm__row">
      <label>
        Travel Mode: </label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          {travelOptions.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name} 
            </option>
            ))}
        </select>
     </div>
      <button className="tripPlanerForm__button" type="submit">Search</button>
    </form>
  );
};

export default TripPlannerForm;


