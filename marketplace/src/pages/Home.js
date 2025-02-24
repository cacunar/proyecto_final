import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import carRentalImage from "../assets/car-rental.webp"; 

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-text">
        <h1>
          La mejor forma de <br />
          <span className="highlight">alquilar tu auto ideal</span>
        </h1>
        <p>Rápido, seguro y sin complicaciones.</p>
        <button onClick={() => navigate("/galeria")} className="cta-button">
          Explorar Autos 🚗
        </button>
      </div>

      <div className="home-image">
        <div className="car-wrapper">
          <img src={carRentalImage} alt="Persona alquilando un auto" className="car-image" />
          <div className="floating-badge">🔑 Alquila fácil y rápido</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
