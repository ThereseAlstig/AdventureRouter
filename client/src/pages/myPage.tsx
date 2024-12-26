import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { MyTrips } from "../components/myTrips";
import { LoadScript } from "@react-google-maps/api";
import { Links } from "../components/links";

export const MyPage = () => {
  const apiKey = import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }  

  const links = [
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
        image: "/solar-cell-7097620_1280.jpg",
        alt: "Looking for adventures",
        text: "Looking for outdooor Electronics?",
        link: "/categories/3/subcategories/8"
    }];
  
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

    function capitalizeName(fullName: string) {
      return fullName
        .split(" ")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
        .join(" ");
    }
    return (
        <>
         { !isAuthenticated && (
            <div className="">
                <h1 className="center">Log in to see your trips</h1>
                <div className="cart-links">
            <Links links={links} />
</div>
            </div>
          )}
      { isAuthenticated &&(
<>
            <h2 className="center">Welcome {username ? capitalizeName(username) : "User"}!</h2>
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