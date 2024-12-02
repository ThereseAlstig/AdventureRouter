import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export const TripPlanner = () => {

    const auth = useContext(AuthContext);

    if (!auth) {
      throw new Error('AuthContext must be used within an AuthProvider');
    }  
    
    const { isAuthenticated } = auth;

    return (
        <>
        {isAuthenticated ?(
            <>
                <h1>My Page</h1>
            </>
                ): (

                    <h1>Log in to access this page</h1>
                )}
            
        </>
    );
}