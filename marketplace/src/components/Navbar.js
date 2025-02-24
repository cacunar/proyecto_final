import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";
import Logo from "../assets/logo21.png";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  console.log("Usuario en Navbar:", user);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={Logo} alt="Compralo Logo" />
      </Link>

      <div className="nav-right">
        <div className="left-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Inicio
          </Link>
          <Link to="/galeria" className={location.pathname === "/galeria" ? "active" : ""}>
            Alquilar
          </Link>
          <Link to="/quienes-somos" className={location.pathname === "/quienes-somos" ? "active" : ""}>
            Quienes Somos
          </Link>
        </div>

        {/* 🔹 Si el usuario NO está autenticado, mostrar "Ingresar" */}
        {!user ? (
          <div className="login-link">
            <Link to="/login">Ingresar</Link>
          </div>
        ) : (
          <div className="user-menu">
            {/* 📌 Ícono de Usuario */}
            <div className="user-icon-container" onClick={() => setMenuOpen(!menuOpen)}>
              {user.image ? (
                <img src={user.image} alt="Perfil" className="user-icon" />
              ) : (
                <FaUserCircle size={30} className="user-icon-default" />
              )}
            </div>

            {/* 📌 Menú Desplegable */}
            {menuOpen && (
              <div className="dropdown-menu">
                <Link to="/perfil" onClick={() => setMenuOpen(false)}>Mi Perfil</Link>
                <Link to="/mis-publicaciones" onClick={() => setMenuOpen(false)}>Mis Publicaciones</Link>
                <button onClick={handleLogout}>Cerrar Sesión</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
