//Hämtar ensklida resor baserade på id

export async function GetSingelTrips(tripId: number) {
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    try {
        const response = await fetch(`${backendUrl}/api/trip/${tripId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get shared adventures');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting shared adventures:', error);
        throw error;
    }
}