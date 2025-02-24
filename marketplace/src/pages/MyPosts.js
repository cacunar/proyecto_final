import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import postService from "../services/postService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/myPosts.css";

function MyPosts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const userPosts = await postService.getUserPosts();
        setPosts(userPosts);
      } catch (error) {
        toast.error("Error al cargar publicaciones.");
        console.error("Error al cargar publicaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta publicación?")) {
      try {
        await postService.deletePost(id);
        setPosts(posts.filter((post) => post.id !== id)); // 🔹 Eliminar localmente la publicación
        toast.success("Publicación eliminada correctamente.");
      } catch (error) {
        toast.error("Error al eliminar la publicación.");
        console.error("Error al eliminar publicación:", error);
      }
    }
  };

  // 🔹 Formatear el precio en CLP
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="my-posts-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <h2>Mis Publicaciones</h2>
      <button className="btn-create" onClick={() => navigate("/create-post")}>
        + Crear Publicación
      </button>

      {loading ? (
        <p>Cargando publicaciones...</p>
      ) : posts.length > 0 ? (
        <div className="table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Título</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <img src={post.image_url} alt={post.title} className="post-image" />
                  </td>
                  <td>{post.title}</td>
                  <td>{formatPrice(post.price)}</td> {/* ✅ Formato CLP */}
                  <td>{post.category}</td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => navigate(`/edit-post/${post.id}`)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleDelete(post.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No tienes publicaciones aún.</p>
      )}
    </div>
  );
}

export default MyPosts;
