import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes";
import "react-toastify/dist/ReactToastify.css"; // 📌 Asegurar la importación de estilos

function App() {
  return (
    <Router> 
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
        {/* 📢 Asegurar que `ToastContainer` esté dentro del `AuthProvider`, pero fuera del contenido */}
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
