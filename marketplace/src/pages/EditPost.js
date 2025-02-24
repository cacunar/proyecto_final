import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import postService from "../services/postService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/editPost.css";

function EditPost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    year: "",
    km: "",
    model: "No especificado",
    fuelType: "No especificado",
    doors: "4",
    version: "No especificado",
    transmission: "No especificado",
    color: "No especificado",
    category: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fuelTypes = [
    "No especificado",
    "Gasolina",
    "Diesel",
    "Hibrido",
    "Electrico",
  ];
  const transmissions = ["No especificado", "Manual", "Automatica", "CVT"];
  const categories = ["", "Sedan", "SUV", "Hatchback", "Pickup", "Coupe"];

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        const post = await postService.getPostById(id);
        if (!post) {
          toast.error("Publicación no encontrada");
          navigate("/mis-publicaciones");
          return;
        }

        setFormData({
          title: post.title || "",
          description: post.description || "",
          price: post.price?.toString() || "",
          year: post.year?.toString() || "",
          km: post.km?.toString() || "",
          model: post.model || "No especificado",
          fuelType: post.fuel_type || "No especificado",
          doors: post.doors?.toString() || "4",
          version: post.version || "No especificado",
          transmission: post.transmission || "No especificado",
          color: post.color || "No especificado",
          category: post.category || "",
          imageUrl: post.image_url || "",
        });

        setPreview(post.image_url || null);
      } catch (error) {
        toast.error("Error cargando la publicación");
        console.error("Error cargando la publicación:", error);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["price", "km", "doors", "year"].includes(name)) {
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });

    if (name === "imageUrl") {
      setPreview(value);
      setImageFile(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, imageUrl: "" });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseInt(formData.price) || 0,
        year: formData.year ? parseInt(formData.year) : 2023,
        km: formData.km ? parseInt(formData.km) : 0,
        model: formData.model.trim() || "No especificado",
        fuelType: formData.fuelType.trim() || "No especificado",
        doors: formData.doors ? parseInt(formData.doors) : 4,
        version: formData.version.trim() || "No especificado",
        transmission: formData.transmission.trim() || "No especificado",
        color: formData.color.trim() || "No especificado",
        category: formData.category.trim() || "No especificado",
        imageUrl: formData.imageUrl.trim(),
      };

      if (imageFile) {
        formattedData.image = imageFile;
      }

      console.log("📌 Datos enviados al backend:", formattedData);

      await postService.updatePost(id, formattedData);
      toast.success("Publicación actualizada exitosamente.");
      setTimeout(() => navigate("/mis-publicaciones"), 2000);
    } catch (error) {
      console.error("Error en la actualización:", error);

      if (error.response) {
        const errorData = error.response.data;

        if (Array.isArray(errorData.errors)) {
          errorData.errors.forEach((err) => toast.error(err.msg));
        } else {
          toast.error(
            errorData.message ||
              "Error desconocido al actualizar la publicación."
          );
        }
      } else {
        toast.error(
          "No se pudo conectar con el servidor. Inténtalo más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-post-page">
      <div className="form-container">
        <h2>Editar Publicación</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group">
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Precio (CLP)</label>
            <input
              type="text"
              name="price"
              value={formData.price ? formatCurrency(formData.price) : ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Año</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Kilometraje</label>
            <input
              type="number"
              name="km"
              value={formData.km}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Modelo</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Combustible</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              required
            >
              {fuelTypes.map((fuel, idx) => (
                <option key={idx} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Puertas</label>
            <input
              type="number"
              name="doors"
              value={formData.doors}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Versión</label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Transmisión</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              required
            >
              {transmissions.map((trans, idx) => (
                <option key={idx} value={trans}>
                  {trans}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Categoría</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Imagen (URL)</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={!!imageFile}
            />
          </div>

          <div className="input-group">
            <label>Subir Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={!!formData.imageUrl}
            />
          </div>

          {preview && (
            <div className="image-preview full-width">
              <img src={preview} alt="Vista previa" />
            </div>
          )}
          <div className="btn-container">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
