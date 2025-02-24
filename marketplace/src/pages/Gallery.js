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

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!searchTerm.trim()) {
        setFilteredPosts(posts);
        return;
      }

      const { data } = await api.get(`/posts?search=${encodeURIComponent(searchTerm)}`);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error al buscar publicaciones:", error);
    } finally {
      setLoading(false);
    
  };

  return (
    <div className="gallery-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por marca, modelo o palabra clave"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} 
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
                id={post.id}
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
