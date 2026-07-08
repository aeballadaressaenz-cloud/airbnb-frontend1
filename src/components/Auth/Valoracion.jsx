import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

function Valoracion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [puntuacion, setPuntuacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (puntuacion === 0) { setError("Seleccioná una puntuación"); return; }
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/reservas/${id}/valoracion`,
        { puntuacion, comentario },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnviado(true);
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al enviar la valoración");
    } finally {
      setCargando(false);
    }
  };

  if (enviado) {
    return (
      <div style={{ backgroundColor: "#f7f7f7", minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "48px 40px", textAlign: "center", maxWidth: "420px", width: "100%" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>★</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111", marginBottom: "8px" }}>¡Gracias por tu valoración!</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>Tu opinión ayuda a otros viajeros a encontrar el alojamiento ideal.</p>
          <button onClick={() => navigate("/")} style={{ padding: "12px 28px", backgroundColor: "#FF385C", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "44px 40px", width: "100%", maxWidth: "480px" }}>

        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111", marginBottom: "6px" }}>
          Calificá tu estadía
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>
          Contanos cómo fue tu experiencia en este alojamiento.
        </p>

        {error && (
          <div style={{ backgroundColor: "#fff0f3", color: "#FF385C", padding: "10px 14px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", border: "1px solid #ffd6de" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Estrellas */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
              Puntuación
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setPuntuacion(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    fontSize: "36px", cursor: "pointer",
                    color: star <= (hover || puntuacion) ? "#F5A623" : "#e0e0e0",
                    transition: "color 0.15s"
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            {puntuacion > 0 && (
              <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#6b7280" }}>
                {["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"][puntuacion]}
              </p>
            )}
          </div>

          {/* Comentario */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Comentario <span style={{ color: "#9ca3af", fontWeight: "400" }}>(opcional)</span>
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="¿Qué te pareció el alojamiento? ¿Lo recomendarías?"
              rows={4}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "8px",
                border: "1.5px solid #e0e0e0", fontSize: "14px",
                fontFamily: "Inter, sans-serif", outline: "none",
                resize: "vertical", boxSizing: "border-box"
              }}
            />
          </div>

          <button type="submit" disabled={cargando} style={{
            width: "100%", padding: "14px", backgroundColor: "#FF385C",
            color: "#fff", border: "none", borderRadius: "8px",
            fontSize: "15px", fontWeight: "600", cursor: "pointer"
          }}>
            {cargando ? "Enviando..." : "Enviar valoración"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Valoracion;