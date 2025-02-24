import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/profile.css";

function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Debes iniciar sesión para ver tu perfil.");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <p className="loading-message">Cargando perfil...</p>;
  }

  if (!user) {
    return <p className="error-message">No se pudo cargar el perfil.</p>;
  }

  return (
    <div className="profile-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="profile-container">
        {user.image ? (
          <img src={user.image} alt="Avatar" className="profile-avatar" />
        ) : (
          <FaUserCircle size={100} className="profile-avatar-default" />
        )}

        <h2>Mi Perfil</h2>
        <p><strong>Nombre:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>País:</strong> {user.country || "No especificado"}</p>
        <p><strong>Teléfono:</strong> {user.phone || "No disponible"}</p>

        <div className="user-posts">
          <button className="btn-view-posts" onClick={() => navigate("/mis-publicaciones")}>
            Ver Publicaciones
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
