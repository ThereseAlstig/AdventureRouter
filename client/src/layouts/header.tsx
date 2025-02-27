import { NavLink, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/_header.scss'
import '../styles/_navigation.scss'
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBars, faLock, faLockOpen, faShoppingCart,faTimes } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import LoginModal from "../components/login";
import { AuthContext } from "../context/authContext";
import { Navigation } from "./navigation";


//Header
export const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const auth = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); 
    
    
    if (!auth) {
      throw new Error('AuthContext must be used within an AuthProvider');
    }
    
     const { isAuthenticated  } = auth;
  

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const openModal = () => {
        setIsModalOpen(true);  // Öppna modalen när användaren vill logga in eller skapa konto
      };
    
      const closeModal = () => {
        setIsModalOpen(false); // Stäng modalen när användaren trycker på "stäng"
      };
    
    

      const handleCloseMenu = () => {
        setIsOpen(false);
      };

      const shouldShowNavigation =
      location.pathname.startsWith('/shop') || location.pathname.startsWith('/categories');
    
    return (
        <header className="bg-gray-800  text-center p-4 ">
            <div className="center">
<div className="topNavigation">
           <NavLink to='/' className='left' aria-label="Link to startpage">
            <h1>Adventure Route</h1>
            </NavLink>

            <img src="/Vintage_and_Retro2.png" alt="Company logo Adventure Route" className="logo" loading="lazy"/>
            
           
<div className="right-icons">
            {isAuthenticated ? (
        // Om användaren är inloggad, visa "Min sida"-knappen
        <>
        <NavLink to="/my-page" className="right" aria-label="My page">
          <FontAwesomeIcon icon={faUser} className="logo-img" />
        </NavLink>
        </>
      ) : (
        // Om användaren inte är inloggad, visa "Logga in/skapa användare"-knappen
        <NavLink to="#" onClick={openModal} className="right" aria-label="loggin in or create account">
          <FontAwesomeIcon icon={faUser} className="logo-img" aria-label="Go to youre page"/>
        </NavLink>
      )}

<LoginModal isOpen={isModalOpen} closeModal={closeModal} />
            <FontAwesomeIcon
  icon={isAuthenticated ? faLock : faLockOpen}
  className="lock-icon"
  title={isAuthenticated ? 'Logged In' : 'Logged Out'}
/></div>

          
</div></div>
  <NavLink to="/cart" className="cart-icon " aria-label="Go to youre cart">
                <FontAwesomeIcon icon={faShoppingCart} />
            </NavLink>

<button className="menu-toggle" onClick={toggleMenu}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>

<div className={`nav-links ${isOpen ? 'open' : ''}`}>
    <NavLink to="/shop" className={({ isActive }) => isActive ? "active-link" : ""}   onClick={handleCloseMenu}>
        <h3>SHOP</h3>
    </NavLink>
    <NavLink to="/journey-planner" className={({ isActive }) => isActive ? "active-link" : ""}  onClick={handleCloseMenu}>
        <h3>JOURNEY PLANNER</h3>
    </NavLink>
    <NavLink to="/shared-adventure" className={({ isActive }) => isActive ? "active-link" : ""}  onClick={handleCloseMenu}>
        <h3>SHARED ADVENTURE</h3>
    </NavLink>
    <NavLink to="/cart" className={({ isActive }) => isActive ? "active-link" : ""}  onClick={handleCloseMenu}>
    <FontAwesomeIcon icon={faShoppingCart} className="cart-icon"/>
        <h3>CART</h3>
    </NavLink>
</div>

{shouldShowNavigation && <Navigation />}
</header>
    );
}