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
        { calificacion: puntuacion, comentario },
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
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg px-10 py-12 text-center max-w-md w-full">
          <div className="text-5xl mb-4">★</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">¡Gracias por tu valoración!</h2>
          <p className="text-gray-500 text-sm mb-7">
            Tu opinión ayuda a otros viajeros a encontrar el alojamiento ideal.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-7 py-3 bg-[#FF385C] text-white rounded-lg font-semibold text-sm hover:bg-[#e03150] transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg px-10 py-11 w-full max-w-lg">

        <h2 className="text-xl font-bold text-gray-900 mb-1.5">
          Calificá tu estadía
        </h2>
        <p className="text-gray-500 text-sm mb-7">
          Contanos cómo fue tu experiencia en este alojamiento.
        </p>

        {error && (
          <div className="bg-[#fff0f3] text-[#FF385C] px-3.5 py-2.5 rounded-lg mb-5 text-sm border border-[#ffd6de]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Estrellas */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Puntuación
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setPuntuacion(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={`text-4xl cursor-pointer transition-colors ${
                    star <= (hover || puntuacion) ? "text-[#F5A623]" : "text-gray-200"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            {puntuacion > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                {["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"][puntuacion]}
              </p>
            )}
          </div>

          {/* Comentario */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Comentario <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="¿Qué te pareció el alojamiento? ¿Lo recomendarías?"
              rows={4}
              className="w-full px-3.5 py-3 rounded-lg border-[1.5px] border-gray-200 text-sm outline-none resize-y box-border"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3.5 bg-[#FF385C] text-white rounded-lg text-sm font-semibold hover:bg-[#e03150] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {cargando ? "Enviando..." : "Enviar valoración"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Valoracion;