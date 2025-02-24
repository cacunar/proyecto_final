import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Importar las páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Gallery from "./pages/Gallery";
import PostDetail from "./pages/PostDetail";
import About from "./pages/About";
import MyPosts from "./pages/MyPosts";
import EditPost from "./pages/EditPost";

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Register />} />
      <Route path="/galeria" element={<Gallery />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/quienes-somos" element={<About />} />

      {/* Rutas protegidas */}
      <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
      <Route path="/mis-publicaciones" element={<PrivateRoute><MyPosts /></PrivateRoute>} />
      <Route path="/edit-post/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />

      {/* Redirección a Home si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
