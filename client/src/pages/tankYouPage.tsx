import React, { useEffect, useState } from 'react';
 // Din lilla GIF-fil

const ThankYouPage: React.FC = () => {
   
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        // Visa texten efter en liten fördröjning
        const timer = setTimeout(() => {
           
            setShowVideo(true);
        }, 3000); 

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="thank-you-container">
            {/* Din GIF */}
            {!showVideo && (
             <h2 className="thank-you-text">
                Thank you for your purchase!<br />
                Your adventure begins now!
            </h2>   
            )}
            
            {showVideo &&(
                <video autoPlay muted loop className="adventure-video" aria-label="A vintage and retro outdoor adventure animation with text Adventure Router Youre journey starts now, Sweden">
                <source src='/Vintage and Retro Outdoor Adventure Animated Logo.mp4' type="video/mp4" />
                Your browser does not support the video tag.
                </video>

            )
            
            }
      </div>
    );
};

export default ThankYouPage;
