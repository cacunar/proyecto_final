import api from "./api";

const postService = {
  getPosts: async () => {
    try {
      const response = await api.get("/posts");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo publicaciones:", error.response?.data || error.message);
      throw error;
    }
  },

  getUserPosts: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      const response = await api.get("/posts/mis-publicaciones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error obteniendo tus publicaciones:", error.response?.data || error.message);
      throw error;
    }
  },

  getPostById: async (id) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo la publicación ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  createPost: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      const response = await api.post("/posts/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creando publicación:", error.response?.data || error.message);
      throw error;
    }
  },

  updatePost: async (id, formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");
  
      const response = await api.put(`/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error(`Error actualizando la publicación ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { message: "Publicación eliminada correctamente" };
    } catch (error) {
      console.error(`Error eliminando la publicación ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default postService;
