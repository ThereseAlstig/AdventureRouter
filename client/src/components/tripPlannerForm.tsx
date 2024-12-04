import React, { useState } from "react";

interface FormProps {
  onSubmit: (data: {
    start: string;
    destination: string;
    waypointList: string[];
    startDate: string;
    arrivalDate: string;
    mode: google.maps.TravelMode;
  }) => void;
}

const TripPlannerForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState("");
  const [startDate, setStartDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [mode, setMode] = useState<string>("DRIVING");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const waypointList = waypoints
      ? waypoints.split(",").map((wp) => wp.trim())
      : [];

    onSubmit({
      start,
      destination,
      waypointList,
      startDate,
      arrivalDate,
      mode: mode as google.maps.TravelMode, // Typkonvertering här
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Start:
        <input
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Start location"
        />
      </label>
      <label>
        Destination:
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
        />
      </label>
      <label>
        Waypoints (comma-separated):
        <input
          type="text"
          value={waypoints}
          onChange={(e) => setWaypoints(e.target.value)}
          placeholder="Optional waypoints"
        />
      </label>
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        Arrival Date:
        <input
          type="date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
        />
      </label>
      <label>
        Travel Mode:
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="DRIVING">Driving</option>
          <option value="DRIVING">Motorcykle</option>
          <option value="WALKING">Walking</option>
          <option value="BICYCLING">Bicycling</option>
          <option value="TRANSIT">Transit</option>
        </select>
      </label>
      <button type="submit">Search</button>
    </form>
  );
};

export default TripPlannerForm;
