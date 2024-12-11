import { useEffect, useState } from "react";
import { MyTravelTips } from "../api/myTravelTips";
import MapWithDirections from "../api/googleMapsApi";

export const MyTrips = () => {
const [trips, setTrips] = useState<any[]>([]);
const [bestExperience, setBestExperience] = useState("");
const [worstExperience, setWorstExperience] = useState("");

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

    useEffect(() => {
        try {
          const fetchTrips = async () => {
            try {
              const myTrips = await MyTravelTips();

              if (!myTrips) {
                throw new Error('Failed to fetch trips');
              }
              console.log('my trips', myTrips);
              setTrips(myTrips);
            } catch (error) {
              console.error('Error fetching trips:', error);
            }
          };

          fetchTrips();
        } catch (error) {   
            console.error('Error fetching trips:', error);
        }
    }
    , []);

    const handleSave = () => {
        console.log('Save trip');
      };

    return (
        <>
        {trips.map((trip, index) => (
          <div key={trip.trip_id + index} className="journey">
          <div  className="trip-container">
            <div className="trip-detail-left">
              <h1>{trip.title}</h1>
              <div className="trip-details">
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
  
              <div className="trip-details2">
                <p>
                  My adventure lasted from{" "}
                  {formatDateToReadable(trip.start_date)} to{" "}
                  {formatDateToReadable(trip.end_date)}.
                </p>
              </div>
              <div className="trip-details3">
    <h2>Best Experience</h2>
    {trip.best_experience ? (
      <p>{trip.best_experience}</p>
    ) : (
      <label>
        Best Experience:
        <input
          type="text"
          value={bestExperience}
          onChange={(e) => setBestExperience(e.target.value)}
        />
      </label>
    )}
  </div>

  <div className="trip-details3">
    <h2>Worst Experience</h2>
    {trip.worst_experience ? (
      <p>{trip.worst_experience}</p>
    ) : (
      <label>
        Worst Experience:
        <input
          type="text"
          value={worstExperience}
          onChange={(e) => setWorstExperience(e.target.value)}
        />
      </label>
    )}
  </div>

  {(!trip.best_experience || !trip.worst_experience) && (
    <button onClick={handleSave}>Save Experiences</button>
  )}
            </div>
            <div className="trip-detail-right">
            <MapWithDirections
              start={trip.start_city}
              destination={trip.end_city}
              waypoints={trip.stops.map((stop: { city_name: string }) => ({
                location: stop.city_name,
                
              }))}
              mode={trip.travel_mode.toUpperCase() as google.maps.TravelMode}
            />
          </div></div>
            <hr className="trip-divider" />
          </div>
        ))}
      </>
    
    );
}