import api from "./api";

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Error en el login:", error.response?.data || error.message);
      throw error;
    }
  },

  register: async (formData) => {
    try {
      const response = await api.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        document: formData.document,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        zipCode: formData.zipCode,
        birthDate: formData.birthDate,
      });
      return response.data;
    } catch (error) {
      console.error("Error en el registro:", error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo usuario:", error.response?.data || error.message);
      return null;
    }
  },
};

export default authService;
