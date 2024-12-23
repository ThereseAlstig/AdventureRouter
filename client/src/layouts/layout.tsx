import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import '../styles/main.scss';
import { useEffect, useState } from "react";



export const Layout = () => {
    const location = useLocation();
    const [fadeIn, setFadeIn] = useState(false);
    
    useEffect(() => {
        setFadeIn(true);
        const timer = setTimeout(() => setFadeIn(false), 500);
        return () => clearTimeout(timer);
      }, [location]);

    return (
        <div className="flex flex-col min-h-screen">
            <header>
                <Header />
            </header>
            <main className={`flex-grow ${fadeIn ? "fade-in" : ""}`}>
           
            <div className={`page page-${location.pathname.replace("/", "")}`}>
          <Outlet />
        </div>
         
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
};