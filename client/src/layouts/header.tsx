import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/_header.scss'
import '../styles/_navigation.scss'
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBars, faLock, faLockOpen, faShoppingCart, faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import LoginModal from "../components/login";
import { AuthContext } from "../context/authContext";

export const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const auth = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    // const navigate = useNavigate();
    if (!auth) {
      throw new Error('AuthContext must be used within an AuthProvider');
    }
    
     const { isAuthenticated,  logout } = auth;
  

console.log(isAuthenticated);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const openModal = () => {
        setIsModalOpen(true);  // Öppna modalen när användaren vill logga in eller skapa konto
      };
    
      const closeModal = () => {
        setIsModalOpen(false); // Stäng modalen när användaren trycker på "stäng"
      };
    
      // const Logout = () => {
      //   // Ta bort token från sessionStorage
      //   sessionStorage.removeItem('token');
      //   setIsAuthenticated(false);  // Uppdatera användartillståndet till utloggad
    
      //   // Omdirigera användaren till inloggningssidan
      //   navigate('/');  // Byt ut '/login' med den aktuella inloggningssidan
      // };

      const handleCloseMenu = () => {
        setIsOpen(false);
      };
    
    return (
        <header className="bg-gray-800  text-center p-4 ">
            <div className="center">
<div className="topNavigation">
           <NavLink to='/' className='left'>
            <h1>Adventure Route</h1>
            </NavLink>

            <img src="/Vintage_and_Retro.png" alt="Company logo Adventure Route" className="logo"/>
            
           {/* <NavLink to='/tripPlanner' className="right">
            <h2 className="logo-text">Logga in/skapa användare</h2>   
            <FontAwesomeIcon icon={faUser} className="logo-img"/>
            </NavLink> */}
<div className="right-icons">
            {isAuthenticated ? (
        // Om användaren är inloggad, visa "Your Account"-knappen
        <>

        <NavLink to="/my-page" className="right">
          <FontAwesomeIcon icon={faUser} className="logo-user" />
        </NavLink>
        </>
      ) : (
        // Om användaren inte är inloggad, visa "Logga in/skapa användare"-knappen
        <NavLink to="#" onClick={openModal} className="right">
          <h2 className="logo-text">Login/create account</h2>
          <FontAwesomeIcon icon={faUser} className="logo-img" />
        </NavLink>
      )}

<LoginModal isOpen={isModalOpen} closeModal={closeModal} setIsAuthenticated={function (isAuthenticated: boolean): void {
              throw new Error("Function not implemented.");
            } }/>
            <FontAwesomeIcon
  icon={isAuthenticated ? faLock : faLockOpen}
  className="lock-icon"
  title={isAuthenticated ? 'Logged In' : 'Logged Out'}
/></div>

          
</div></div>
  <NavLink to="/cart" className="cart-icon ">
                <FontAwesomeIcon icon={faShoppingCart} />
            </NavLink>

<button className="menu-toggle" onClick={toggleMenu}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>

<div className={`nav-links ${isOpen ? 'open' : ''}`}>
    <NavLink to="/shop" className={({ isActive }) => isActive ? "active-link" : ""}   onClick={handleCloseMenu}>
        <h2>SHOP</h2>
    </NavLink>
    <NavLink to="/journey-planner" className={({ isActive }) => isActive ? "active-link" : ""}  onClick={handleCloseMenu}>
        <h2>JOURNEY PLANNER</h2>
    </NavLink>
    <NavLink to="/shared-adventure" className={({ isActive }) => isActive ? "active-link" : ""}  onClick={handleCloseMenu}>
        <h2>SHARED ADVENTURE</h2>
    </NavLink>
    <NavLink to="/cart" className={({ isActive }) => isActive ? "active-link" : ""}  onClick={handleCloseMenu}>
    <FontAwesomeIcon icon={faShoppingCart} className="cart-icon"/>
        <h2>CART</h2>
    </NavLink>
</div>

            

        </header>
    );
}