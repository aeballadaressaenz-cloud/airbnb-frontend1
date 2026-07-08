import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [fotoError, setFotoError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get(`${BASE_URL}/api/usuarios/perfil`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsuario(res.data))
    .catch(() => {
      const data = localStorage.getItem("usuario");
      if (data) setUsuario(JSON.parse(data));
    });
  }, []);

  if (!usuario) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>No hay datos de usuario</p>;
  }

  // Cache-busting: evita que el navegador muestre la foto vieja en caché
  // después de editarla. Si tu API devuelve un campo tipo updated_at o
  // foto_actualizada_en, usalo acá en vez de Date.now() para que la URL
  // solo cambie cuando la foto realmente cambió.
  const fotoUrl = `${BASE_URL}/api/usuarios/${usuario.id_usuario}/foto?t=${usuario.foto_actualizada_en || Date.now()}`;

  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "calc(100vh - 80px)", padding: "40px 20px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* Card principal */}
        <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", overflow: "hidden" }}>

          {/* Banner */}
          <div style={{ height: "100px", background: "linear-gradient(135deg, #FF385C, #ff6b81)" }} />

          {/* Avatar y nombre */}
          <div style={{ padding: "0 32px 32px", position: "relative" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "#FF385C", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "28px", fontWeight: "700",
              color: "#fff", border: "4px solid #fff",
              position: "relative", top: "-40px", marginBottom: "-20px", overflow: "hidden"
            }}>
              {usuario.id_usuario && !fotoError ? (
                <img
                  src={fotoUrl}
                  alt="Foto de perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => setFotoError(true)}
                />
              ) : (
                usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "?"
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: "700", color: "#111" }}>
                  {usuario.nombre} {usuario.apellido || ""}
                </h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>{usuario.email}</p>
                <span style={{
                  display: "inline-block", marginTop: "8px",
                  backgroundColor: "#fff0f3", color: "#FF385C",
                  padding: "3px 12px", borderRadius: "20px",
                  fontSize: "12px", fontWeight: "600", border: "1px solid #ffd6de"
                }}>
                  {usuario.rol}
                </span>
              </div>
              <Link to="/editar-perfil" style={{
                padding: "10px 20px", backgroundColor: "#fff", color: "#111",
                border: "1.5px solid #ddd", borderRadius: "8px",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
                textDecoration: "none"
              }}>
                Editar perfil
              </Link>
            </div>
          </div>
        </div>

        {/* Info personal */}
        <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "28px 32px", marginTop: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700", color: "#111" }}>
            Información personal
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nombre</p>
              <p style={{ margin: 0, fontSize: "14px", color: "#111", fontWeight: "500" }}>{usuario.nombre} {usuario.apellido || ""}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Correo</p>
              <p style={{ margin: 0, fontSize: "14px", color: "#111", fontWeight: "500" }}>{usuario.email}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Teléfono</p>
              <p style={{ margin: 0, fontSize: "14px", color: usuario.telefono ? "#111" : "#9ca3af", fontWeight: "500" }}>
                {usuario.telefono || "No agregado"}
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Rol</p>
              <p style={{ margin: 0, fontSize: "14px", color: "#111", fontWeight: "500", textTransform: "capitalize" }}>{usuario.rol}</p>
            </div>
          </div>
        </div>

        {/* Sección según rol */}
        {usuario.rol === "huesped" && (
          <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "28px 32px", marginTop: "20px" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: "#111" }}>Mis reservas</h3>
            <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: "14px" }}>
              Todavía no tenés reservas activas. Explorá destinos y encontrá tu próximo alojamiento.
            </p>
            <Link to="/" style={{
              display: "inline-block", padding: "12px 24px",
              backgroundColor: "#FF385C", color: "#fff",
              borderRadius: "8px", textDecoration: "none",
              fontSize: "14px", fontWeight: "600"
            }}>
              Explorar alojamientos
            </Link>
          </div>
        )}

        {usuario.rol === "anfitrion" && (
          <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "28px 32px", marginTop: "20px" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: "#111" }}>Mis alojamientos</h3>
            <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: "14px" }}>
              Administrá tus propiedades y revisá las reservas de tus huéspedes.
            </p>
            <Link to="/" style={{
              display: "inline-block", padding: "12px 24px",
              backgroundColor: "#FF385C", color: "#fff",
              borderRadius: "8px", textDecoration: "none",
              fontSize: "14px", fontWeight: "600"
            }}>
              Ver mis propiedades
            </Link>
          </div>
        )}

        {usuario.rol === "admin" && (
          <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "28px 32px", marginTop: "20px" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: "#111" }}>Panel de administración</h3>
            <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: "14px" }}>
              Tenés acceso completo a la plataforma. Gestioná usuarios, alojamientos y reservas.
            </p>
            <Link to="/" style={{
              display: "inline-block", padding: "12px 24px",
              backgroundColor: "#111", color: "#fff",
              borderRadius: "8px", textDecoration: "none",
              fontSize: "14px", fontWeight: "600"
            }}>
              Ir al panel
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default Perfil;