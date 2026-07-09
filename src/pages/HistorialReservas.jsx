import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function HistorialReservas() {
  const navigate = useNavigate();

  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cancelando, setCancelando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const obtenerHistorial = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Debes iniciar sesión para ver tus reservas.");
      setCargando(false);
      return;
    }

    try {
      const respuesta = await api.get("/reservas/historial");
      setReservas(respuesta.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "No se pudo cargar el historial de reservas."
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerHistorial();
  }, []);

  const cancelarReserva = async (idReserva) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas cancelar esta reserva?"
    );

    if (!confirmar) return;

    const motivo = window.prompt(
      "Escribe el motivo de cancelación:",
      "Cancelado por el usuario"
    );

    setCancelando(idReserva);
    setMensaje("");
    setError("");

    try {
      const respuesta = await api.delete(`/reservas/${idReserva}`, {
        data: {
          motivo: motivo || "Cancelado por el usuario",
        },
      });

      setMensaje(
        `Reserva cancelada. Monto de reembolso: $${respuesta.data.monto_reembolso}`
      );

      await obtenerHistorial();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo cancelar la reserva.");
    } finally {
      setCancelando(null);
    }
  };

  if (cargando) {
    return (
      <main className="booking-page">
        <section className="booking-card">
          <p>Cargando historial de reservas...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <section className="booking-card booking-history-card">
        <div className="booking-header">
          <h1>Mis reservas</h1>
          <p>Consulta tus reservas y cancela cuando sea necesario.</p>
        </div>

        {error && <p className="booking-error">{error}</p>}
        {mensaje && <p className="booking-success">{mensaje}</p>}

        {reservas.length === 0 ? (
          <div className="empty-history">
            <p>No tienes reservas registradas.</p>
            <Link to="/">Buscar alojamientos</Link>
          </div>
        ) : (
          <div className="history-list">
            {reservas.map((reserva) => (
              <article className="history-item" key={reserva.id_reserva}>
                <div>
                  <h2>{reserva.alojamiento}</h2>
                  <p>{reserva.ciudad}</p>
                </div>

                <div className="history-data">
                  <p>
                    <span>Entrada:</span>
                    <strong>
                      {new Date(reserva.fecha_entrada).toLocaleDateString("es-NI")}
                    </strong>
                  </p>

                  <p>
                    <span>Salida:</span>
                    <strong>
                      {new Date(reserva.fecha_salida).toLocaleDateString("es-NI")}
                    </strong>
                  </p>

                  <p>
                    <span>Noches:</span>
                    <strong>{reserva.noches}</strong>
                  </p>

                  <p>
                    <span>Total:</span>
                    <strong>${reserva.precio_total}</strong>
                  </p>

                  <p>
                    <span>Estado:</span>
                    <strong>{reserva.estado}</strong>
                  </p>

                  <p>
                    <span>Calificación:</span>
                    <strong>{reserva.calificacion || "Sin valorar"}</strong>
                  </p>
                </div>

                <div className="history-actions">
                  {reserva.estado !== "cancelada" && (
                    <button
                      type="button"
                      onClick={() => cancelarReserva(reserva.id_reserva)}
                      disabled={cancelando === reserva.id_reserva}
                    >
                      {cancelando === reserva.id_reserva
                        ? "Cancelando..."
                        : "Cancelar reserva"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="booking-links">
          <Link to="/">Volver al inicio</Link>
        </div>
      </section>
    </main>
  );
}

export default HistorialReservas;