import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import '../styles/main.scss';


export const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen ">
          
                <header>
                    <Header />
                </header>
                <main className="flex-grow">
                    <Outlet />
                </main>
                <footer className="">
                    <Footer />
                </footer>
          
        </div>
    );
};