export async function GetSharedAdventures() {
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
    try {
        const response = await fetch(`${backendUrl}/api/travels`);
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