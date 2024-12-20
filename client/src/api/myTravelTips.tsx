
// Hämtar resor kopplat till användaren
export async function MyTravelTips() {
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
    const email = sessionStorage.getItem('userEmail');
    const token = sessionStorage.getItem('token');
    if (!email) {
        throw new Error('Authentication token is missing. Please login again.');
    }
    try {
        const response = await fetch(`${backendUrl}/api/travels/${email}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get trips');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting trips:', error);
        throw error;
    }
}