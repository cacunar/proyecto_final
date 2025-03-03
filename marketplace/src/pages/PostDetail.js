import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import postService from "../services/postService";
import "../styles/postDetail.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPostById(id);
        setPost(data);
        const API_BASE_URL = process.env.REACT_APP_API_URL;
        const imageUrl = `${API_BASE_URL}/posts/${id}/image`;
        setSelectedImage(imageUrl);
      } catch (error) {
        console.error("Error al obtener publicación", error);
        toast.error("Error al cargar la publicación.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleRent = () => {
    toast.info("Funcionalidad de alquiler en desarrollo 🚀");
  };

  const handleConsult = () => {
    toast.info("Funcionalidad de consulta en desarrollo 🛠️");
  };

  if (loading) return <p className="loading-message">Cargando publicación...</p>;
  if (!post) return <p className="error-message">Publicación no encontrada.</p>;

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <div className="main-image-container">
          <img src={selectedImage} alt={post.title} className="main-image" />
        </div>

        <div className="post-info">
          <h2>{post.title}</h2>
          <p className="post-year-km">{post.year} | {post.km?.toLocaleString() || "No especificado"} km</p>
          <p className="post-price">${new Intl.NumberFormat("es-CL").format(post.price)} CLP</p>

          <button className="btn-consult" onClick={handleConsult}>Consultar</button>
          <button className="btn-rent" onClick={handleRent}>Alquilar</button>
        </div>
      </div>

      <div className="post-description">
        <h3>Descripción</h3>
        <p>{post.description || "Sin descripción disponible."}</p>
      </div>

      <div className="post-features">
        <strong><h3>Características</h3></strong>
        <table>
          <tbody>
            <tr>
              <td><strong>Modelo:</strong></td><td>{post.model}</td>
              <td><strong>Tipo de combustible:</strong></td><td>{post.fuel_type}</td>
            </tr>
            <tr>
              <td><strong>Año:</strong></td><td>{post.year}</td>
              <td><strong>Puertas:</strong></td><td>{post.doors}</td>
            </tr>
            <tr>
              <td><strong>Versión:</strong></td><td>{post.version}</td>
              <td><strong>Transmisión:</strong></td><td>{post.transmission}</td>
            </tr>
            <tr>
              <td><strong>Color:</strong></td><td>{post.color}</td>
              <td><strong>Tipo de carrocería:</strong></td><td>{post.body_type}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostDetail;
