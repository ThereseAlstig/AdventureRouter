
import { useEffect, useState } from "react";
import MapWithDirections from "../api/googleMapsApi";
import { GetSharedAdventures } from "../api/getSharedTrips";
import { fetchTripImage } from "../api/fetchImg";
  

  
  export const SharedTrips = () => {
   const [trips, setTrips] = useState<any[]>([]);
   const [tripImages, setTripImages] = useState<{ [key: number]: string | null }>({});

       useEffect(() => {
         const loadTrips = async () => {
           try {
         
       
             const tripsData = await GetSharedAdventures();
       
             if (!tripsData) {
               throw new Error('Failed to fetch trips');
             }
       
             setTrips(tripsData);
             localStorage.setItem('trips', JSON.stringify(tripsData));
       console.log(trips);
             const images = await Promise.all(
               tripsData.map(async (trip: any) => {
                 const imageUrl = await fetchTripImage(trip.trip_id);
                 return { tripId: trip.trip_id, imageUrl };
               })
             );
       
             const imageMap = images.reduce((acc, curr) => {
               acc[curr.tripId] = curr.imageUrl;
               return acc;
             }, {} as { [key: number]: string | null });
       
             setTripImages(imageMap);
             localStorage.setItem('tripImages', JSON.stringify(imageMap));
           } catch (err: any) {
             console.error(err);
           }
         };
       
         loadTrips();
       }, []);
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
          <div key={trip.trip_id + index} className="journey">
          <div className="trip-container">
            <div className="trip-detail-left">
              <h1>{trip.title}</h1>

            <div className="trip-details3">
                {tripImages[trip.trip_id] && tripImages[trip.trip_id] !== "Image for trip null" ? (
        <img
            src={tripImages[trip.trip_id]!} // Endast om URL finns och inte är "null"
            alt={`Image for trip ${trip.title}`}
            loading="lazy"
            width="200"
        />
    ) : (
        <p></p> // Fallback när ingen bild finns
    )}
</div>
              
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
              {trip.best_experience? (
                <div className="trips-best">
                  <h2>Best:</h2>
                  <p>{trip.best_experience}</p>
                
                </div>
              ) : null}
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






  