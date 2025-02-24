import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await api.get("/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Usuario obtenido desde API:", res.data);
                setUser(res.data);
            } catch (error) {
                console.error("Error al obtener usuario:", error);

                // 📌 Si el error es 401 (token inválido), se borra el usuario
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    if (loading) {
        return <p className="loading-message">Cargando usuario...</p>; // ✅ No renderizar la app hasta que termine la carga
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
