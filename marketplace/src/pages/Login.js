import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import "../styles/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, ingresa tu email y contraseña.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        toast.success("Inicio de sesión exitoso. Redirigiendo...");

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast.error("No se recibió un token válido.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al iniciar sesión.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      await api.post("/auth/reset-password", { email: resetEmail });
      toast.success("Correo de recuperación enviado con éxito.");
      setTimeout(() => {
        setShowResetPassword(false);
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al solicitar restablecimiento.");
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="login-container">
        {!showResetPassword ? (
          <>
            <h2>Iniciar sesión</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="input-group password-group">
                <label>Contraseña</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-login">Ingresar</button>
            </form>

            <div className="forgot-password">
              <Link to="#" className="forgot-link" onClick={() => setShowResetPassword(true)}>
                Olvidé mi clave
              </Link>
            </div>

            <div className="divider">O ingresa con</div>

            <button className="btn-google">
              <FcGoogle size={20} /> Ingresar con Google
            </button>

            <div className="register-link">
              ¿No tienes cuenta? <Link to="/registrar">Regístrate</Link>
            </div>
          </>
        ) : (
          <>
            <h2>Restablecer Contraseña</h2>
            <p>Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.</p>
            <form className="reset-form" onSubmit={handleResetPassword}>
              <div className="input-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-reset">Enviar</button>
            </form>
            <button className="btn-close" onClick={() => setShowResetPassword(false)}>Volver</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
