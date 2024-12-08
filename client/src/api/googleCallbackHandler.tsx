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

        if (token) {
            try {
                if (googleLogin) {
                    googleLogin(token); // Använd googleLogin för att lagra token
                } else {
                    console.error('googleLogin is undefined');
                    navigate('/login');
                }
                navigate('/my-page'); // Navigera till en skyddad sida
            } catch (error) {
                console.error('Error during Google login:', error);
                navigate('/login'); // Navigera tillbaka till login vid fel
            }
        } else {
            console.error('Missing token in callback URL');
            navigate('/login'); // Navigera tillbaka till login vid fel
        }
    }, [googleLogin, navigate]);

    return <div>Laddar...</div>;
};

export default GoogleCallbackHandler;
