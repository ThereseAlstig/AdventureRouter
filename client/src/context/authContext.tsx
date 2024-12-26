import { createContext, useState, useEffect, ReactNode } from 'react';
import  TransferCartToUser  from '../api/transferCartToUser';


// Skapa Context

interface AuthContextType {
    isAuthenticated: boolean;
    email: string | null;
    username: string | null;
    userRole: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    googleLogin: (token: string, email: string, username: string) => void;
  }


interface AuthProviderProps {
  children: ReactNode;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: AuthProviderProps) => {

  const key = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  //Hämtar token från sessionStorage och uppdaterar inloggning
  useEffect(() => { 
  
    const token = sessionStorage.getItem('token');
    const storedEmail = sessionStorage.getItem('userEmail');
    const storedUsername = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('userRole');
    setIsAuthenticated(!!token); 
    setEmail(storedEmail);
    setUsername(storedUsername);
    setIsAuthenticated(!!token);
    setUserRole(role); 
  }, []);


  //Inloggning för användare
  const login = async (email: string, password: string) => {

    const response = await fetch(`${key}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

setUserRole(data.role);
    if (!response.ok) {
      throw new Error(data.message || 'Invalid credentials');
    }
  
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('username', data.username);
    sessionStorage.setItem('userRole', data.role);
    setIsAuthenticated(true);
    setEmail(email);
    setUsername(data.username);
    
    const cartId = sessionStorage.getItem('cartId');
  
    if(cartId){
      try {
     
        await TransferCartToUser(cartId, email);
        sessionStorage.removeItem('cartId'); // Rensa efter överföring
    
      } catch (error: any) {
        console.error('Error transferring cart:', error.message);
      }
    }
  };

//inlogg för både Google och Github - admin kan ej logga in via github eller google
  const googleLogin = async (token: string, email: string = '', username: string = '') => {
    
    if (token) {
          
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userEmail', email); 
      sessionStorage.setItem('username', username);
      setIsAuthenticated(true);
      setEmail(email); 
      setUsername(username);
      const cartId = sessionStorage.getItem('cartId');
   
    if(cartId){
      try {
      
        await TransferCartToUser(cartId, email);
        sessionStorage.removeItem('cartId'); // Rensa efter överföring
       
      } catch (error: any) {
        console.error('Error transferring cart:', error.message);
      }
    }
    } else {
      throw new Error('Google login failed: Missing token');
    }
  };


  //Utloggning för användare (ALLA)
  const logout = async () => {
 
    try {
      
        const response = await fetch(`${key}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
       
        if (!response.ok) {
          throw new Error('Logout failed');
        }
  
        // Ta bort token från sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setEmail(null);
        setUsername(null);
     
      } catch (err) {
        // Hantera eventuella fel under logout-processen
        console.error(err);
      }
    };

    const verifyToken = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${key}/auth/protected-resource`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          console.log('Token is valid.');
          return true;
        } else {
          console.log('Token is invalid or expired. Logging out...');
          logout();
          return false;
        }
      } catch (err) {
        console.error(err);
        logout();
      }
    }

    // Verifiera token var 10:e minut så att användarens token inte går ut är giltig 2h
    useEffect(() => {
      const interval = setInterval(() => {
     
        verifyToken();
      }, 10 * 60 * 1000); // Verifiera var 10:e minut
    
      return () => clearInterval(interval); // Rensa intervallen vid avmontering
    }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, email, username, userRole, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
