import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext'; // Importera AuthContext


//inloggning för Google
const GoogleCallbackHandler: React.FC = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const googleLogin = auth?.googleLogin;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email') || ''; 
        const username = params.get('username') || '';


        if (token) {
           

                if (googleLogin) {
                    googleLogin(token,  email ?? '', username ?? ''); 
                    navigate('/my-page');
                    // Använd googleLogin för att lagra token
                }else {
                    console.error('Missing token in callback URL');
                    navigate('/'); // Navigera till startsidan vid fel
                }
        }
    }, [googleLogin, navigate]);

    return <div>Laddar...</div>;
};

export default GoogleCallbackHandler;
