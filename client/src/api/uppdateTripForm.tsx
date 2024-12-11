
//spara ner bilder

export const uploadImage = async (tripId: number, image: File): Promise<void> => {
    const formData = new FormData();
    formData.append("image", image);

    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
    const token = sessionStorage.getItem("token");

    try {
        const response = await fetch(`${backendUrl}/api/trips/${tripId}/image`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to upload image. Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Image uploaded successfully:", result);
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};
