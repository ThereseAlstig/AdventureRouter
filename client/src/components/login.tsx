import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // För omdirigering i React Router v6
 // För API-anrop
import '../styles/_loginModal.scss';
import { AuthContext } from '../context/authContext';


interface LoginModalProps {
  isOpen: boolean;
  closeModal: () => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, closeModal, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // För lyckat konto skapande
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // För att växla mellan login och skapa konto
  const navigate = useNavigate(); // För att kunna omdirigera
  const auth = useContext(AuthContext);
  const handleGoogleLogin = () => {
    // Omdirigera användaren till Google OAuth-flödet via backend
    window.location.href = 'http://localhost:3000/user/google';
    console.log('google login');
  };
  if (!auth) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }  
  
  const { login, isAuthenticated } = auth;
  // Hantera inloggning
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(email, password); // Anropa login från Context
      navigate('/my-page'); // Omdirigera användaren
      closeModal(); // Stäng modalen
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  // Hantera skapande av nytt konto
  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please provide valid credentials.');
      return;
    }

    try {
      // Skicka POST-begäran till backend för att skapa användare
    const response =  await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();  // Konvertera svaret till JSON
      // Visa meddelande om att kontot skapades framgångsrikt
      if (response.ok){
      setSuccessMessage('You have an account, please login.');
      
console.log(data);
      }
     

      // Återställ felmeddelanden
      setError('');
      
      // Växla till login-formuläret efter en stund (eller när användaren trycker på OK)
      setTimeout(() => {
        setIsCreatingAccount(false);
        setSuccessMessage('');
      }, 2000);  // Vänta 2 sekunder innan vi byter tillbaka till login

    } catch (err) {
      // Hantera fel (t.ex. om användaren redan finns)
      setError('Error creating account. Please try again.');
    }
  };

  // Om modalen inte är öppen, rendera inget
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isCreatingAccount ? 'Create Account' : 'Log in or create an account'}</h2>
        
        {/* Om vi är i skapande av konto-läge, visa formuläret för att skapa konto */}
        <form onSubmit={isCreatingAccount ? handleCreateAccount : handleLogin}>
          <div>
            <label>E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isCreatingAccount ? 'Create Account' : 'Log In'}</button>
          {!isCreatingAccount && (<button onClick={handleGoogleLogin}>{isCreatingAccount ? 'Create Account' : 'Log In Via google'}</button>)}
          {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Visa felmeddelande om det finns */}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Visa framgångsmeddelande */}
        </form>

        {/* Knapp för att växla mellan login och skapa konto */}
        <button onClick={() => setIsCreatingAccount(!isCreatingAccount)}>
          {isCreatingAccount ? 'Already have an account? Log in' : 'Create a new account'}
        </button>

        {/* Stäng knappen */}
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default LoginModal;
