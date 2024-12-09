import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext'; // Importera AuthContext

const GoogleCallbackHandler: React.FC = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const googleLogin = auth?.googleLogin;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        console.log('Token from URL:', token);
        if (token) {
            console.log('Current URL:', window.location.href);

            try {
                if (googleLogin) {
                    googleLogin(token); 
                    navigate('/my-page');
                    // Använd googleLogin för att lagra token
                } 
            } catch (error) {
                console.error('Error during Google login:', error);
                navigate('/'); // Navigera tillbaka till login vid fel
            }
        }
    }, [googleLogin, navigate]);

    return <div>Laddar...</div>;
};

export default GoogleCallbackHandler;
