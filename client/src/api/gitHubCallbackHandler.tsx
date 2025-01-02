import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext'; 
import { useNavigate } from 'react-router-dom';


//Till inloggning för Github
const GitHubCallbackHandler: React.FC = () => {
    
    const auth = useContext(AuthContext);
    const googleLogin = auth?.googleLogin; // Återanvänder googleLogin för GitHub
    const navigate = useNavigate();
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email');
        const username = params.get('username');

     

        if (token) {
            if (googleLogin) {
                googleLogin(token, email || '', username || ''); // Använd samma login-funktion för GitHub
                navigate('/my-page'); 
        } else {
            console.error('Missing token in callback URL');
            navigate('/'); // Navigera till startsidan vid fel
        }
    }
    }, [googleLogin, navigate]);

    return <div>Laddar...</div>;
};

export default GitHubCallbackHandler;
