import { useEffect, useState } from "react";
import { MyTravelTips } from "../api/myTravelTips";
import MapWithDirections from "../api/googleMapsApi";
import { uploadImage } from "../api/uppdateTripForm";
import { fetchTripImage } from "../api/fetchImg";
import { Links } from "./links";

//Mina resor
export const MyTrips = () => {
const [trips, setTrips] = useState<any[]>([]);
const [tripImages, setTripImages] = useState<{ [key: number]: string | null }>({});
const [scrollPosition, setScrollPosition] = useState(0);
const [refreshTrigger, setRefreshTrigger] = useState(false);

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
    window.scrollTo(0, scrollPosition); // Återställ scrollposition efter datahämtning
}, [trips]); 

    useEffect(() => {
        try {
          const fetchTrips = async () => {
            try {
              const myTrips = await MyTravelTips();

              if (!myTrips) {
                throw new Error('Failed to fetch trips');
              }
             
              setTrips(myTrips);
             
              const images = await Promise.all(
                myTrips.map(async (trip: any) => {
                    const imageUrl = await fetchTripImage(trip.trip_id);
                    return { tripId: trip.trip_id, imageUrl };
                })
            );

            // Uppdatera state med bilder
            const imageMap = images.reduce((acc, curr) => {
                acc[curr.tripId] = curr.imageUrl;
                return acc;
            }, {} as { [key: number]: string | null });

            setTripImages(imageMap);

       
            } catch (error) {
              console.error('Error fetching trips:', error);
            }
          };

          fetchTrips();
        } catch (error) {   
            console.error('Error fetching trips:', error);
        }
    }
    , [refreshTrigger]);

   


//Spara ner resa från formulär
    const handleSaveImage = async (tripId: number) => {
        const trip = trips.find((t) => t.trip_id === tripId);
        if (!trip || !trip.image) {
            alert("Please select an image before saving.");
            return;
        }
    
        const formData = new FormData();
        formData.append("image", trip.image);
    
        try {

          setScrollPosition(window.scrollY);
          const uploadedImageUrl = await uploadImage(tripId, trip.image);
          console.log("Uploaded Image URL:", uploadedImageUrl);
  
          // Uppdatera `tripImages`

          
        const updatedImageUrl = await fetchTripImage(tripId);

        if (!updatedImageUrl) {
          throw new Error(`Failed to fetch updated image for trip ${tripId}`);
      }
      //Uppdatera bild
      setRefreshTrigger((prev) => !prev);
            alert("Image uploaded successfully!");
          
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        }
    };
    

//Sparar best och worst experience
    const handleSave = async (tripId: number) => {
      
        const tripIndex = trips.findIndex((t) => t.trip_id === tripId);
        if (tripIndex === -1) return;
    
        const trip = trips[tripIndex];
        const { bestExperience, worstExperience, image } = trip;
    
        if (!bestExperience.trim() || !worstExperience.trim()) {
            alert("Both 'Best Experience' and 'Worst Experience' are required.");
            return;
        }

        if (!bestExperience && !worstExperience && !image) {
            alert("Please fill in experiences or upload an image.");
            return;
        }
    
       
        const uppdatedTrip = {
            
            best_experience: bestExperience,
            worst_experience: worstExperience,
        }

        const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
        const token = sessionStorage.getItem("token");
       
        try {
          const currentScrollY = window.scrollY;
            const response = await fetch(`${backendUrl}/api/trips/${tripId}`, {
                method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // Token för autentisering
            },
            body: JSON.stringify(uppdatedTrip),
        });
    
            if (!response.ok) {
                throw new Error("Failed to update trip");
            }
            setTrips((prevTrips) =>
                prevTrips.map((trip) =>
                    trip.trip_id === tripId
                        ? { ...trip, best_experience: bestExperience, worst_experience: worstExperience }
                        : trip
                )
            );

            window.scrollTo(0, currentScrollY);
            alert("Trip updated successfully!");
    
            // Töm värden för den aktuella resan
            setTrips((prevTrips) =>
                prevTrips.map((t, index) =>
                    index === tripIndex
                        ? { ...t, bestExperience: "", worstExperience: "", image: null }
                        : t
                )
            );
           
        } catch (error) {
            console.error("Error updating trip:", error);
            alert("Failed to update trip.");
        }
    };

    //länkar till interna reklam länkar, som syns om man inte har några produkter i kundvagnen
    const links1 = [
      {
          image: "/solar-cell-7097620_1280.jpg",
          alt: "Looking for adventures",
          text: "Looking for outdooor Electronics?",
          link: "/categories/3/subcategories/8"
      },
      {
          image: "/woman.png",
          alt: "hiking",
          text: "Plan your next adventure.",
          link: "/journey-planner"
      },
      {
          image: "/man.png",
          alt: "hiking",
          text: "Find your adventure essentials",
          link: "/shop"
      
      }];

      //Länkar till interna reklam länkar 2 
      const links2 = [
          {
              image: "/adventure-1850178_1280.jpg",
              alt: "hiking",
              text: "Find your hiking essentials",
              link: "/categories/1/subcategories/2"
          },
          {
              image: "/bike-7365418_1280.jpg",
              alt: "hiking",
              text: "Top gear for cycling.",
              link: "/categories/2/subcategories/4"
          },
          {
              image: "/walk.png",
              alt: "Looking for adventures",
              text: "Looking for your next adventure?",
              link: "/shared-adventure"
           
          }];

          function capitalize(city: string) {
            return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
          }


    return (
        <>
        {trips.map((trip, index) => (
          <div key={trip.trip_id + index} className="journey">
          <div className="trip-container">
            <div className="trip-detail-left">
              <h1>{trip.title}</h1>
              <div className="trip-details">
                <p>From {capitalize(trip.start_city)} to {capitalize(trip.end_city)}</p>
                {trip.stops.length > 0 && (
                  <>
                    <p>Stopping in </p>
                    <p>{trip.stops.map((stop: { city_name: string }) => stop.city_name).join(" and ")}</p>
                  </>
                )}
                <p>Traveling by {trip.travel_mode}.</p>
              </div>
              <div className="trip-details">
                <p>
                  My adventure lasted from {formatDateToReadable(trip.start_date)} to {formatDateToReadable(trip.end_date)}.
                </p>
              </div>
        
        <div className="weather-forecast">
          <h2>Weather forecast:</h2>
          {trip.start_weather && (
            <div>
          <h3>{capitalize(trip.start_city)}</h3>
            <p>Temperature: {trip.start_weather.temperature}°C, Wind speed: {trip.start_weather.wind_speed}, {trip.start_weather.description}</p>
          </div>)}
          {trip.end_weather && (
            <div>
              <h3>{capitalize(trip.end_city)}</h3>
              <p>Temperature: {trip.end_weather.temperature}°C, Wind speed: {trip.end_weather.wind_speed}, {trip.end_weather.description}</p>
          <p></p>
          </div>)}
              
          
        </div>
              {!trip.best_experience && !trip.worst_experience && (
                <div className="trip-details3">
                  <h2>Best:</h2>
                  <label htmlFor="bestExperience">
                    <input
                      type="text"
                      value={trip.bestExperience || ''}
                      onChange={(e) =>
                        setTrips((prevTrips) =>
                          prevTrips.map((t) =>
                            t.trip_id === trip.trip_id
                              ? { ...t, bestExperience: e.target.value }
                              : t
                          )
                        )
                      }
                    />
                  </label>
                  <h2>Worst:</h2>
                  <label htmlFor="worstExperience">
                    <input
                      type="text"
                      value={trip.worstExperience || ''}
                      onChange={(e) =>
                        setTrips((prevTrips) =>
                          prevTrips.map((t) =>
                            t.trip_id === trip.trip_id
                              ? { ...t, worstExperience: e.target.value }
                              : t
                          )
                        )
                      }
                    />
                  </label>
                  <button onClick={() => handleSave(trip.trip_id)}>Save Experiences</button>
                </div>
              )}
        
              <div className="image-upload">
                {tripImages[trip.trip_id] && tripImages[trip.trip_id] !== "Image for trip null" ? (
                  <img
                    src={tripImages[trip.trip_id]!}
                    alt={`Image for trip ${trip.title}`}
                    width="200"
                    className="trip-image"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <label htmlFor="imgage">Image:</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setTrips((prevTrips) =>
                          prevTrips.map((t) =>
                            t.trip_id === trip.trip_id
                              ? { ...t, image: e.target.files ? e.target.files[0] : null }
                              : t
                          )
                        )
                      }
                    />
                    <button
                      className="save-image"
                      onClick={() => handleSaveImage(trip.trip_id)}
                      disabled={!trip.image}
                    >
                      Save Image
                    </button>
                  </>
                )}
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
              {trip.best_experience || trip.worst_experience ? (
                <div className="trip-details3-under-map">
                  <h2>Best:</h2>
                  <p>{trip.best_experience}</p>
                  <h2>Worst:</h2>
                  <p>{trip.worst_experience}</p>
                </div>
              ) : null}
            </div>
          </div>
          <hr className="trip-divider" />
        </div>
        ))}

        {trips.length === 0 && (
          
          <>
          <div className="cart-links">
        <Links links={links1} />
</div>
<div className="cart-links">
        <Links links={links2} />
</div>
</>
        )
          }

      </>
    
    );
}