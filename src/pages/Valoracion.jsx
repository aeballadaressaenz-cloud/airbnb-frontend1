import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Valoracion() {
  const { idReserva } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    calificacion: 5,
    comentario: "",
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const enviarValoracion = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setCargando(true);
    setMensaje("");
    setError("");

    try {
      await api.post(`/reservas/${idReserva}/valoracion`, {
        calificacion: Number(formulario.calificacion),
        comentario: formulario.comentario,
      });

      setMensaje("Valoración registrada correctamente.");

      setTimeout(() => {
        navigate("/perfil");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "No se pudo registrar la valoración. Verifica que la reserva exista, esté completada y no haya sido valorada antes."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-large">
        <div className="auth-header">
          <h1>Valorar estancia</h1>
          <p>
            Comparte tu experiencia sobre la reserva #{idReserva}.
          </p>
        </div>

        <form className="auth-form" onSubmit={enviarValoracion}>
          <label>
            Calificación
            <select
              name="calificacion"
              value={formulario.calificacion}
              onChange={manejarCambio}
              required
            >
              <option value="5">5 estrellas - Excelente</option>
              <option value="4">4 estrellas - Muy buena</option>
              <option value="3">3 estrellas - Buena</option>
              <option value="2">2 estrellas - Regular</option>
              <option value="1">1 estrella - Mala</option>
            </select>
          </label>

          <label>
            Comentario
            <textarea
              name="comentario"
              value={formulario.comentario}
              onChange={manejarCambio}
              placeholder="Escribe un comentario breve sobre tu experiencia..."
              rows="5"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {mensaje && <p className="auth-success">{mensaje}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Enviando valoración..." : "Enviar valoración"}
          </button>
        </form>

        <p className="auth-link">
          <Link to="/perfil">Volver a mi perfil</Link>
        </p>
      </section>
    </main>
  );
}

export default Valoracion;