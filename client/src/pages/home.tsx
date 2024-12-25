
import { url } from "inspector";
import { Links } from "../components/links";

export const Home = () => {

//Länkar och innehåll till intern reklam länkar
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

        const url = new URL(
            `https://www.youtube-nocookie.com/embed/WRQUMfsbMR0?cc_load_policy=0&cc=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`
          );

    return (
        <> 
             <div className="movieContainer">
             <div className="responsive-video">
            <iframe
      src={url.toString()}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      className="video__iframe"
      allowFullScreen
      loading="lazy"
    ></iframe>

  
                </div>
                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        <div className="homepageWords">
            <h2>Adventure Awaits: Discover the Gear and Guidance for Your Next Big Journey.</h2>   
        </div>

            <div>
                <Links links={links} />
            </div>
        </>
    );
}