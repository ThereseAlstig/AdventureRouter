
import '../styles/_shop.scss'
import { Links } from "../components/links";


//Förstasidan för produkterna
export const Shop = () => {


    //Länkar och innehåll till intern reklam länkar
const links = [
    {
        image: "/adventure-1850178_1280.jpg",
        alt: "hiking",
        text: "Find your hiking essentials",
        link: "/categories/1/subcategories/2"
    },
    {
        image: "/bike-7365418_1280.jpg",
        alt: "hiking",
        text: "Top gear for cycling.",
        link: "/categories/2/subcategories/4"
    },
    {
        image: "/solar-cell-7097620_1280.jpg",
        alt: "Looking for adventures",
        text: "Looking for outdooor Electronics?",
        link: "/categories/3/subcategories/8"
    }];

    return (
        <>
    

        <div className="imgContainer">
           <img src="../public/boots-4417595_1280.jpg" alt="shop" className="backgroundImage"/>
           <h1 className="shop-title homepageWords">Top Gear for Every Journey</h1>
         </div>   

         <div className="homepageWords">
            <h2>Adventure Awaits: Discover the Gear and Guidance for Your Next Big Journey.</h2>
         </div>
         <Links links={links} />
        </>
    );
}