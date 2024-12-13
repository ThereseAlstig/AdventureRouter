
import { Links } from "../components/links";

export const Home = () => {


    const links = [
        {
            image: "/man.png",
            alt: "hiking",
            text: "Find your adventure essentials",
            link: "/shop"
        },
        {
            image: "/woman.png",
            alt: "hiking",
            text: "Plan your next adventure.",
            link: "/journey-planner"
        },
        {
            image: "/walk.png",
            alt: "Looking for adventures",
            text: "Looking for your next adventure?",
            link: "/shared-adventure"
        }];


    return (
        <>
            <h2>Här visas en film om hur man hittar på sidan</h2>

        <div className="homepageWords">
            <h2>Adventure Awaits: Discover the Gear and Guidance for Your Next Big Journey.</h2>   
        </div>

            <div>
                <Links links={links} />
            </div>
        </>
    );
}