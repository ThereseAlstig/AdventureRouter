import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole: 'admin'; 
}

//Skyddar admin sidan
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const auth = useContext(AuthContext);
 // Om användaren inte är inloggad, omdirigera till startsidan
    if (!auth?.isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (auth.userRole !== requiredRole) {
        // Om användaren inte har rätt roll, omdirigera till startsidan
        return <Navigate to="/" replace />;
    }

    // Om användaren är inloggad och har rätt roll, rendera sidan
    return <>{children}</>;
};

export default ProtectedRoute;
