import { createContext, useState, useEffect, ReactNode } from 'react';

// Skapa Context

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    googleLogin: (token: string) => void;
  }


interface AuthProviderProps {
  children: ReactNode;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: AuthProviderProps) => {

  const key = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
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
    setIsAuthenticated(true);
  };


  const googleLogin = (token: string) => {
    if (token) {
      sessionStorage.setItem('token', token);
      setIsAuthenticated(true);
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
        setIsAuthenticated(false);
        console.log(isAuthenticated);
        // Omdirigera användaren till inloggningssidan eller startsidan efter utloggning
        // Byt ut '/login' med den faktiska inloggningssidan om den är annorlunda
      } catch (err) {
        // Hantera eventuella fel under logout-processen
        console.error(err);
      }
    };


  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
