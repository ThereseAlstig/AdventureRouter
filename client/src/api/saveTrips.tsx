import { Trip } from '../types/Trips';


//Skapa en resa
export async function SaveTrip(trip: Trip) {

    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;


    const token = sessionStorage.getItem('token');
    if (!token) {
        throw new Error('Authentication token is missing. Please login again.');
    }
 
    try {
        const response = await fetch(`${backendUrl}/api/travel-journey`, {
            method: 'POST',
            headers: {
               
                Authorization: `Bearer ${token}`,
                 'Content-Type': 'application/json',
            },
            body: JSON.stringify(trip),
        });

        if (!response.ok) {
            // Om responsen inte är ok, kasta ett fel
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save trip');
        }

        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving trip:', error);
        throw error;
    }
}