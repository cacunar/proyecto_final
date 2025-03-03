import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/register.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    document: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    zipCode: "",
    birthDate: "",
    termsAccepted: false,
  });

  const [isUnderage, setIsUnderage] = useState(false);

  const navigate = useNavigate();

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "birthDate") {
      const age = calculateAge(value);
      setIsUnderage(age < 18);
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      toast.error("Debes aceptar los términos y condiciones.");
      return;
    }

    if (isUnderage) {
      toast.error("Debes ser mayor de 18 años para registrarte.");
      return;
    }

    try {
      await authService.register(formData);
      toast.success("Registro exitoso. Redirigiendo a login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error en el registro.");
    }
  };

  return (
    <div className="register-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="register-container">
        <h2>Registrarse</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label>Nombre</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Apellido</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>País</label>
              <select name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Selecciona un país</option>
                <option value="Chile">Chile</option>
                <option value="Argentina">Argentina</option>
                <option value="México">México</option>
                <option value="España">España</option>
              </select>
            </div>
            <div className="input-group">
              <label>RUT / DNI</label>
              <input type="text" name="document" value={formData.document} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Teléfono</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Dirección</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Código Postal</label>
              <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>Fecha de Nacimiento</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
          </div>

          {isUnderage && (
            <div className="age-warning">
              ❌ Debes ser mayor de 18 años para registrarte.
            </div>
          )}

          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="terms">
            <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} />
            <label>He leído los <a href="/terminos">Términos y Condiciones</a></label>
          </div>

          <button type="submit" className="btn-register" disabled={!formData.termsAccepted || isUnderage}>
            Crear cuenta
          </button>

          <div className="login-return">
            ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
