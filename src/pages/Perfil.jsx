import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Perfil() {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerPerfil = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const respuesta = await api.get("/usuarios/perfil");
        setPerfil(respuesta.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "No se pudo cargar la información del perfil."
        );

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setTimeout(() => {
            navigate("/login");
          }, 900);
        }
      } finally {
        setCargando(false);
      }
    };

    obtenerPerfil();
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  if (cargando) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="auth-loading">Cargando perfil...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-header">
            <h1>Perfil</h1>
            <p>No fue posible obtener tus datos.</p>
          </div>

          <p className="auth-error">{error}</p>

          <button className="auth-secondary-button" onClick={() => navigate("/login")}>
            Volver al login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-large">
        <div className="auth-header">
          <h1>Mi perfil</h1>
          <p>Información de tu cuenta en Nómada.</p>
        </div>

        <div className="profile-box">
          <div className="profile-avatar">
            {perfil?.nombre?.charAt(0)}
            {perfil?.apellido?.charAt(0)}
          </div>

          <div className="profile-info">
            <h2>
              {perfil?.nombre} {perfil?.apellido}
            </h2>
            <p>{perfil?.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-row">
            <span>Nombre</span>
            <strong>{perfil?.nombre || "No registrado"}</strong>
          </div>

          <div className="profile-row">
            <span>Apellido</span>
            <strong>{perfil?.apellido || "No registrado"}</strong>
          </div>

          <div className="profile-row">
            <span>Correo</span>
            <strong>{perfil?.email || "No registrado"}</strong>
          </div>

          <div className="profile-row">
            <span>Teléfono</span>
            <strong>{perfil?.telefono || "No registrado"}</strong>
          </div>

          <div className="profile-row">
            <span>Rol</span>
            <strong>{perfil?.rol || "No registrado"}</strong>
          </div>

          <div className="profile-row">
            <span>Fecha de registro</span>
            <strong>
              {perfil?.fecha_registro
                ? new Date(perfil.fecha_registro).toLocaleDateString("es-NI")
                : "No disponible"}
            </strong>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/" className="auth-secondary-link">
            Volver al inicio
          </Link>

          <button className="auth-danger-button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </section>
    </main>
  );
}

export default Perfil;