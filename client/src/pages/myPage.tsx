import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { MyTrips } from "../components/myTrips";
import { LoadScript } from "@react-google-maps/api";

export const MyPage = () => {
  const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }  
  
  const { logout, isAuthenticated } = auth;

    const navigate = useNavigate(); 

    const handleLogout = async () => {
      console.log('logout');
      try {
        logout(); // Anropa logout från Context
        navigate('/'); 
        console.log(isAuthenticated)// Omdirigera till startsidan efter utloggning
      } catch (err) {
        console.error('Logout failed', err);
      }
    };


    return (
        <>
         
      { isAuthenticated &&(
<>

            <button className="logoutButton" onClick={handleLogout}>Log Out</button>
            <LoadScript googleMapsApiKey={apiKey}>
            <div>
              <MyTrips/>
            </div>
            </LoadScript>
</>
      )


      }
            
        </>
    );
}