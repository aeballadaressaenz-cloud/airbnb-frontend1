import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Reserva() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [alojamiento, setAlojamiento] = useState(null);
  const [formulario, setFormulario] = useState({
    fecha_entrada: "",
    fecha_salida: "",
    num_huespedes: 1,
    notas_huesped: "",
  });

  const [cargando, setCargando] = useState(false);
  const [cargandoAlojamiento, setCargandoAlojamiento] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    const obtenerAlojamiento = async () => {
      try {
        const respuesta = await api.get(`/alojamientos/${id}`);
        setAlojamiento(respuesta.data.alojamiento);
      } catch (err) {
        setError("No se pudo cargar la información del alojamiento.");
      } finally {
        setCargandoAlojamiento(false);
      }
    };

    obtenerAlojamiento();
  }, [id]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const crearReserva = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Debes iniciar sesión antes de realizar una reserva.");
      return;
    }

    setCargando(true);
    setMensaje("");
    setError("");
    setResumen(null);

    try {
      const respuesta = await api.post("/reservas", {
        id_alojamiento: Number(id),
        fecha_entrada: formulario.fecha_entrada,
        fecha_salida: formulario.fecha_salida,
        num_huespedes: Number(formulario.num_huespedes),
        notas_huesped: formulario.notas_huesped,
      });

      setResumen(respuesta.data);
      setMensaje("Reserva creada exitosamente.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "No se pudo crear la reserva. Verifica fechas, disponibilidad y cantidad de huéspedes."
      );
    } finally {
      setCargando(false);
    }
  };

  if (cargandoAlojamiento) {
    return (
      <main className="booking-page">
        <section className="booking-card">
          <p>Cargando alojamiento...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <section className="booking-card booking-card-large">
        <div className="booking-header">
          <h1>Reservar alojamiento</h1>
          <p>Completa los datos para confirmar tu reserva.</p>
        </div>

        {alojamiento && (
          <div className="booking-summary">
            <h2>{alojamiento.titulo}</h2>
            <p>
              {alojamiento.ciudad}, {alojamiento.pais}
            </p>
            <strong>${alojamiento.precio_por_noche} / noche</strong>
          </div>
        )}

        <form className="booking-form" onSubmit={crearReserva}>
          <div className="booking-grid">
            <label>
              Fecha de entrada
              <input
                type="date"
                name="fecha_entrada"
                value={formulario.fecha_entrada}
                onChange={manejarCambio}
                required
              />
            </label>

            <label>
              Fecha de salida
              <input
                type="date"
                name="fecha_salida"
                value={formulario.fecha_salida}
                onChange={manejarCambio}
                required
              />
            </label>
          </div>

          <label>
            Número de huéspedes
            <input
              type="number"
              name="num_huespedes"
              min="1"
              value={formulario.num_huespedes}
              onChange={manejarCambio}
              required
            />
          </label>

          <label>
            Notas para el anfitrión
            <textarea
              name="notas_huesped"
              value={formulario.notas_huesped}
              onChange={manejarCambio}
              placeholder="Ejemplo: llegaremos por la tarde."
              rows="4"
            />
          </label>

          {error && <p className="booking-error">{error}</p>}
          {mensaje && <p className="booking-success">{mensaje}</p>}

          {resumen && (
            <div className="booking-result">
              <p>
                <span>ID reserva:</span>
                <strong>{resumen.id_reserva}</strong>
              </p>
              <p>
                <span>Noches:</span>
                <strong>{resumen.noches}</strong>
              </p>
              <p>
                <span>Total:</span>
                <strong>${resumen.precio_total}</strong>
              </p>
            </div>
          )}

          <button type="submit" disabled={cargando}>
            {cargando ? "Creando reserva..." : "Confirmar reserva"}
          </button>
        </form>

        <div className="booking-links">
          <Link to="/">Volver al inicio</Link>
          <Link to="/mis-reservas">Ver mis reservas</Link>
        </div>
      </section>
    </main>
  );
}

export default Reserva;