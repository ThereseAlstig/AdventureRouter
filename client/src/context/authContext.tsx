import { createContext, useState, useEffect, ReactNode } from 'react';


// Skapa Context

interface AuthContextType {
    isAuthenticated: boolean;
    email: string | null;
    username: string | null;
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

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedEmail = sessionStorage.getItem('userEmail');
    const storedUsername = sessionStorage.getItem('username');
    setIsAuthenticated(!!token); // Kontrollera om en token finns
    setEmail(storedEmail);
    setUsername(storedUsername);
    setIsAuthenticated(!!token); // Kontrollera om en token finns
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${key}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid credentials');
    }

    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('username', data.username);
    setIsAuthenticated(true);
    setEmail(email);
    setUsername(data.username);
  };


  const googleLogin = (token: string, email: string = '', username: string = '') => {
    
    if (token) {
           console.log('Saving token in sessionStorage...');
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userEmail', email); 
      sessionStorage.setItem('username', username);
      setIsAuthenticated(true);
      setEmail(email); 
      setUsername(username);
    } else {
      throw new Error('Google login failed: Missing token');
    }
  };

  const logout = async () => {
    console.log('logout');
    try {
        // Skicka en POST-begäran till backend för att logga ut användaren
        const response = await fetch(`${key}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // Om backend inte svarar med status 200, visa ett felmeddelande
        if (!response.ok) {
          throw new Error('Logout failed');
        }
  
        // Ta bort token från sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('username');
        setIsAuthenticated(false);
        setEmail(null);
        setUsername(null);
        console.log(isAuthenticated);
        // Omdirigera användaren till inloggningssidan eller startsidan efter utloggning
        // Byt ut '/login' med den faktiska inloggningssidan om den är annorlunda
      } catch (err) {
        // Hantera eventuella fel under logout-processen
        console.error(err);
      }
    };


  return (
    <AuthContext.Provider value={{ isAuthenticated, email, username, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
