import "../styles/about.css"; // Importamos los estilos
import teamImage from "../assets/team.jpg"; // Imagen representativa

function About() {
  return (
    <div className="about-container">
      <section className="about-header">
        <h1>Quiénes Somos</h1>
        <p>La plataforma que conecta a alquilantes y alquiladores de autos de forma segura y eficiente.</p>
      </section>

      <section className="about-content">
        <div className="about-text">
          <h2>Nuestra Misión</h2>
          <p>Crear una comunidad de movilidad accesible, donde alquilar o rentar un auto sea una experiencia rápida y confiable.</p>

          <h2>Nuestros Valores</h2>
          <ul>
            <li>✅ Conexión directa entre alquilantes y alquiladores</li>
            <li>✅ Seguridad y confianza en cada transacción</li>
            <li>✅ Flexibilidad para cada necesidad</li>
            <li>✅ Transparencia y sin costos ocultos</li>
            <li>✅ Innovación en la movilidad</li>
          </ul>
        </div>
        
        <div className="about-image">
          <img src={teamImage} alt="Equipo Alquílalo" />
        </div>
      </section>
    </div>
  );
}

export default About;
