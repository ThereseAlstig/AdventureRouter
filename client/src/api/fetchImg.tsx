export const fetchTripImage = async (tripId: number): Promise<string | null> => {
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    try {
        const response = await fetch(`${backendUrl}/api/trips/${tripId}/image`, {
            method: "GET",
        });


       
        if (!response.ok) {
            throw new Error(`Failed to fetch image for trip ${tripId}. Status: ${response.status}`);
        }
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.startsWith("image/")) {

            //denna ger en error även om det inte är en 404
            // console.warn(`Response for trip ${tripId} does not contain valid image data.`);
            return null; // Returnera null om ingen giltig bilddata finns
        }

        // Omvandla responsen till en Blob och skapa en URL för bilden
        const blob = await response.blob();
        
        return URL.createObjectURL(blob);
    } catch (error) {
        if (error instanceof Error && error.message.includes("404")) {
            console.error(error.message);
            return null;
        }
        console.error(`Error fetching image for trip ${tripId}:`, error);
        return null;
    }
};
