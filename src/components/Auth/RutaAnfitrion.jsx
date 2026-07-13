import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

function RutaAnfitrion({ children }) {
  const { usuario, isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (usuario?.rol !== "anfitrion" && usuario?.rol !== "ambos") {
    return <Navigate to="/" />;
  }

  return children;
}

export default RutaAnfitrion;