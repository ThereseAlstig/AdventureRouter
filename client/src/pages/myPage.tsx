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

// const Logout = async() => {
  

//     try {
//         // Skicka en POST-begäran till backend för att logga ut användaren
//         const response = await fetch('http://localhost:3000/auth/logout', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
  
//         // Om backend inte svarar med status 200, visa ett felmeddelande
//         if (!response.ok) {
//           throw new Error('Logout failed');
//         }
  
//         // Ta bort token från sessionStorage
//         sessionStorage.removeItem('token');
  
//         // Omdirigera användaren till inloggningssidan eller startsidan efter utloggning
//         navigate('/'); // Byt ut '/login' med den faktiska inloggningssidan om den är annorlunda
//       } catch (err) {
//         // Hantera eventuella fel under logout-processen
//         console.error(err);
//       }
//     };

    return (
        <>
         
      { isAuthenticated &&(
<>
<h2>My Page</h2>
            <button onClick={handleLogout}>Log Out</button>
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