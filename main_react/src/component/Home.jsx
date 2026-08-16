import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {

    const navigate = useNavigate();

    return (
        <div className="home-page">

            <nav className="home-navbar">

                <h2>Vehicle Hub</h2>

                

                <button
                    className="home-login-btn"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>

            </nav>


            <div className="home-content">

                <div className="home-text">

                    <p className="home-label">
                        VEHICLE MANAGEMENT SYSTEM
                    </p>

                    <h1>
                        Find Your Perfect
                        <br />
                        Vehicle With Us
                    </h1>

                    <p className="home-description">
                        Buy and sell vehicles easily with Vehicle Hub.
                        Explore available vehicles and choose the one
                        that suits your needs.
                    </p>

                    <button
                        className="get-started-btn"
                        onClick={() => navigate("/register")}
                    >
                        Get Started
                    </button>

                </div>


                <div className="home-image">

                    <div className="car-shape">
                        🚗
                    </div>

                </div>

            </div>


            <div className="home-features">

                <div className="feature-card">
                    <h3>Buy Vehicles</h3>
                    <p>
                        Find and purchase your desired vehicle easily.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>Sell Vehicles</h3>
                    <p>
                        List your vehicle and reach potential buyers.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>Easy Management</h3>
                    <p>
                        Manage vehicle information in one place.
                    </p>
                </div>

            </div>

        </div>
    );
}

export default Home;
