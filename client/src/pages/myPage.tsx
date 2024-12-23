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
  
  const { logout, isAuthenticated, username } = auth;

    const navigate = useNavigate(); 


    //Utloggning för samtliga anändare Även google och github användare
    const handleLogout = async () => {
      console.log('logout');
      try {
        logout(); 
        navigate('/'); 
        
      } catch (err) {
        console.error('Logout failed', err);
      }
    };


    return (
        <>
         { !isAuthenticated && (
            <div className="center">
                <h1>Log in to see your trips</h1>
            </div>
          )}
      { isAuthenticated &&(
<>
            <h2 className="center">Welcome {username}!</h2>
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