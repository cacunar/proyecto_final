import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import postService from "../services/postService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/createPost.css";

function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    year: 2023,
    km: "",
    model: "",
    fuelType: "",
    doors: 4,
    version: "",
    transmission: "",
    color: "",
    bodyType: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fuelTypes = ["Gasolina", "Diésel", "Híbrido", "Eléctrico"];
  const transmissions = ["Manual", "Automática", "CVT"];
  const bodyTypes = ["Sedán", "SUV", "Hatchback", "Pickup", "Coupé"];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" || name === "km" || name === "doors" || name === "year") {
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, imageUrl: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      toast.error("Debes iniciar sesión para publicar.");
      navigate("/login");
      return;
    }
  
    const formattedData = {
      title: formData.title.trim() || "-",
      description: formData.description.trim() || "-",
      price: parseInt(formData.price) || 0,
      category: formData.category || "-",
      year: parseInt(formData.year) || 2023,
      km: parseInt(formData.km) || 0,
      model: formData.model.trim() || "-",
      fuelType: formData.fuelType || "-",
      doors: parseInt(formData.doors) || 4,
      version: formData.version.trim() || "-",
      transmission: formData.transmission || "-",
      color: formData.color.trim() || "-",
      bodyType: formData.bodyType || "-",
      imageUrl: formData.imageUrl.trim(),
    };
  
    if (
      !formattedData.title ||
      !formattedData.description ||
      !formattedData.price ||
      !formattedData.category ||
      !formattedData.year ||
      !formattedData.km ||
      !formattedData.model ||
      !formattedData.fuelType ||
      !formattedData.doors ||
      !formattedData.version ||
      !formattedData.transmission ||
      !formattedData.color ||
      !formattedData.bodyType ||
      (!formattedData.imageUrl && !imageFile)
    ) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }
  
    const formDataToSend = new FormData();
    Object.entries(formattedData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
  
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }
  
    setLoading(true);
    try {
      await postService.createPost(formDataToSend);
      toast.success("Publicación creada exitosamente!");
      setTimeout(() => navigate("/mis-publicaciones"), 2000);
    } catch (error) {
      console.error("❌ Error en la publicación:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        error.response.data.errors.forEach((err) => {
          toast.error(err.msg);
        });
      } else {
        toast.error("Error al crear publicación. Inténtalo nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="create-post-page">
      <ToastContainer />
      <div className="form-container">
        <h2>Crear Publicación</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Título</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Descripción</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <div className="input-group">
            <label>Precio (CLP)</label>
            <input type="text" name="price" value={formatCurrency(formData.price)} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Año</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Kilometraje</label>
            <input type="number" name="km" value={formData.km} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Modelo</label>
            <input type="text" name="model" value={formData.model} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Tipo de Combustible</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleChange} required>
              {fuelTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Puertas</label>
            <input type="number" name="doors" value={formData.doors} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Versión</label>
            <input type="text" name="version" value={formData.version} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Transmisión</label>
            <select name="transmission" value={formData.transmission} onChange={handleChange} required>
              {transmissions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Color</label>
            <input type="text" name="color" value={formData.color} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Tipo de Carrocería</label>
            <select name="bodyType" value={formData.bodyType} onChange={handleChange} required>
              {bodyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>URL de la Imagen</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} disabled={!!imageFile} />
          </div>

          <div className="input-group">
            <label>Subir Imagen</label>
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={!!formData.imageUrl} />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
