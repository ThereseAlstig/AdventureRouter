import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom"
import { AuthContext } from "../context/authContext";

export const Footer = () => {

    const context = useContext(AuthContext);
    const userRole = context?.userRole;

    useEffect(() => {
        console.log("userRole", userRole);
    }, [userRole]);
    return (
        <footer className="footer">
            <div className="left-footer">
                <Link to="/about-us">
                <h3>About us</h3>
                </Link>
                <h3>Contact us:
                </h3>
                <a href="tel:+123456789">+123 456 </a>
                <a href="mailto:adventure.router@gmail.com">adventure.router@gmail.com</a>
                
            </div>
            <h1 className="middle-footer">Adventure Awaits You</h1>
            <p className="right-footer">&copy; 2025 - All rights reserved Adventure Router AB</p>
           {(

            <Link to="/admin"><FontAwesomeIcon icon={faGear}/></Link>
           )} 
        </footer>
    );
}