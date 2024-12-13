interface Link {
    image: string;
    alt: string;
    text: string;
    link: string;
}

interface LinksProps {
    links: Link[]; // Renamed to 'links' for clarity
}

export const Links: React.FC<LinksProps> = ({ links }) => {
    return (
        <div className="linksContainer">
            {links.slice(0, 3).map((on, index) => (
                <a 
                    key={index} 
                    href={on.link} 
                    rel="noopener noreferrer" 
                    className="linkWrapper"
                >
                    <img 
                        src={on.image} 
                        alt={on.alt} 
                        className="styledImage"
                    />
                    <div className="overlay">
                        <h2 className="overlayTex">{on.text}</h2>
                        <div className="arrow">→</div>
                    </div>
                </a>
            ))}
        </div>
    );
};
