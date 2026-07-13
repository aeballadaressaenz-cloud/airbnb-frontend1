import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

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
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <section className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-500">Cargando historial de reservas...</p>
        </section>
      </main>
    );
  }

  // Colores según el estado de la reserva
  const estadoStyles = {
    confirmada: "bg-green-50 text-green-700 border-green-200",
    pendiente: "bg-yellow-50 text-yellow-700 border-yellow-200",
    cancelada: "bg-red-50 text-red-700 border-red-200",
    completada: "bg-blue-50 text-blue-700 border-blue-200",
  };

  // Calcula el estado a mostrar sin depender de que el backend lo haya actualizado
  const getEstadoVisual = (reserva) => {
    const yaFinalizo = new Date(reserva.fecha_salida) < new Date();
    if (reserva.estado === "cancelada") return "cancelada";
    if (yaFinalizo) return "completada";
    return reserva.estado;
  };

  return (
    <main className="min-h-screen flex items-start justify-center bg-gray-50 px-4 py-12">
      <section className="fade w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        {/* Encabezado */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Mis reservas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Consulta tus reservas y cancela cuando sea necesario.
          </p>
        </div>

        {error && (
          <p className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm mb-4">
            {error}
          </p>
        )}
        {mensaje && (
          <p className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-3.5 py-2.5 text-sm mb-4">
            {mensaje}
          </p>
        )}

        {reservas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No tienes reservas registradas.</p>
            <Link
              to="/"
              className="inline-block mt-3 text-[#e03150] font-semibold hover:underline"
            >
              Buscar alojamientos
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reservas.map((reserva) => {
              const yaFinalizo = new Date(reserva.fecha_salida) < new Date();
              const puedeCalificar =
                yaFinalizo &&
                reserva.estado !== "cancelada" &&
                !reserva.calificacion;
              const estadoVisual = getEstadoVisual(reserva);

              return (
                <article
                  className="border border-gray-200 rounded-xl p-5 flex flex-col gap-3.5 transition hover:shadow-md hover:-translate-y-0.5"
                  key={reserva.id_reserva}
                >
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {reserva.alojamiento}
                    </h2>
                    <p className="text-gray-500 text-sm">{reserva.ciudad}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 bg-gray-50 rounded-lg px-4 py-3.5">
                    <p className="flex flex-col gap-0.5">
                      <span className="text-gray-500 text-[0.7rem] uppercase tracking-wide">
                        Entrada
                      </span>
                      <strong className="text-gray-800 text-sm">
                        {new Date(reserva.fecha_entrada).toLocaleDateString("es-NI")}
                      </strong>
                    </p>

                    <p className="flex flex-col gap-0.5">
                      <span className="text-gray-500 text-[0.7rem] uppercase tracking-wide">
                        Salida
                      </span>
                      <strong className="text-gray-800 text-sm">
                        {new Date(reserva.fecha_salida).toLocaleDateString("es-NI")}
                      </strong>
                    </p>

                    <p className="flex flex-col gap-0.5">
                      <span className="text-gray-500 text-[0.7rem] uppercase tracking-wide">
                        Noches
                      </span>
                      <strong className="text-gray-800 text-sm">{reserva.noches}</strong>
                    </p>

                    <p className="flex flex-col gap-0.5">
                      <span className="text-gray-500 text-[0.7rem] uppercase tracking-wide">
                        Total
                      </span>
                      <strong className="text-gray-800 text-sm">
                        ${reserva.precio_total}
                      </strong>
                    </p>

                    <p className="flex flex-col gap-0.5">
                      <span className="text-gray-500 text-[0.7rem] uppercase tracking-wide">
                        Estado
                      </span>
                      <strong
                        className={`inline-block w-fit text-xs font-semibold rounded-full px-2.5 py-0.5 border ${
                          estadoStyles[estadoVisual] ||
                          "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {estadoVisual}
                      </strong>
                    </p>

                    <p className="flex flex-col gap-0.5">
                      <span className="text-gray-500 text-[0.7rem] uppercase tracking-wide">
                        Calificación
                      </span>
                      <strong className="text-gray-800 text-sm">
                        {reserva.calificacion || "Sin valorar"}
                      </strong>
                    </p>
                  </div>

                  <div className="flex justify-end gap-2.5">
                    {puedeCalificar && (
                      <Link
                        to={`/valoracion/${reserva.id_reserva}`}
                        className="bg-[#FF385C] text-white font-semibold text-sm rounded-full px-4.5 py-2 hover:bg-[#e03150] transition"
                      >
                        Calificar estadía
                      </Link>
                    )}

                    {reserva.estado !== "cancelada" && !yaFinalizo && (
                      <button
                        type="button"
                        onClick={() => cancelarReserva(reserva.id_reserva)}
                        disabled={cancelando === reserva.id_reserva}
                        className="bg-[#ec4f70] text-white font-semibold text-sm rounded-full px-4.5 py-2 disabled:bg-[#f3a5b4] disabled:cursor-not-allowed transition"
                      >
                        {cancelando === reserva.id_reserva
                          ? "Cancelando..."
                          : "Cancelar reserva"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="flex justify-start mt-6 pt-4 border-t border-gray-200 text-sm font-semibold">
          <Link to="/" className="text-[#e03150] hover:underline">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HistorialReservas;