export const Home = () => {
    return (
        <>
            <h2>Här visas en film om hur man hittar på sidan</h2>


            <h2>Adventure Awaits: Discover the Gear and Guidance for Your Next Big Journey.</h2>   


            <div>
                <img src="../public/man.png" alt="man on walk" height={550} width={550}/>
                <div className="overlay">
                        <h2 className="text">Find your adventure essentials</h2>
                        <div className="arrow">→</div>
                    </div>
                <img src="../public/woman.png" alt="man on walk" height={550} width={550}/>
                <div className="overlay">
                        <h2 className="text">Plan your next adventure.</h2>
                        <div className="arrow">→</div>
                    </div>
                <img src="../public/walk.png" alt="man walking"height={550} width={550}/>
                <div className="overlay">
                        <h2 className="text">Looking for your next adventure?</h2>
                        <div className="arrow">→</div>
                    </div>

            </div>
        </>
    );
}