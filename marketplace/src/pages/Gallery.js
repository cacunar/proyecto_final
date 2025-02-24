import { useState, useEffect } from "react";
import api from "../services/api";
import Card from "../components/Card";
import "../styles/gallery.css";

function Gallery() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error al cargar publicaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 🔹 Función para realizar la búsqueda en el backend
  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!searchTerm.trim()) {
        setFilteredPosts(posts); // Si no hay búsqueda, mostrar todos
        return;
      }

      const { data } = await api.get(`/posts?search=${encodeURIComponent(searchTerm)}`);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error al buscar publicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gallery-container">
      {/* 🔹 Buscador con Enter o botón */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por marca, modelo o palabra clave"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Buscar al presionar Enter
        />
        <button className="search-button" onClick={handleSearch}>
          🔍
        </button>
      </div>

      {loading ? (
        <p className="loading-text">Cargando publicaciones...</p>
      ) : (
        <div className={`posts ${filteredPosts.length === 1 ? "single-post" : ""}`}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card
                key={post.id}
                id={post.id} // 🔹 Agregar ID para navegación
                title={post.title}
                price={post.price}
                image={post.image_url}
              />
            ))
          ) : (
            <p className="no-posts">No hay publicaciones disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Gallery;
