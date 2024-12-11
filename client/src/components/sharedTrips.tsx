
import MapWithDirections from "../api/googleMapsApi";
  
  interface ISharedTripsProps {
    trips: any[];
  }
  
  export const SharedTrips = ({ trips }: ISharedTripsProps) => {
   
   
    // Formaterar datum
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
  
    return (
      <>
        {trips.map((trip, index) => (
          <div className="journey">
          <div key={trip.trip_id + index} className="trip-container">
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
  };




  