import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../services/api";

function Reserva() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Valores que vienen desde DetalleAlojamiento (si el usuario ya eligió
  // fechas/huéspedes ahí). Si entra directo a esta página, quedan vacíos.
  const datosPrevios = location.state || {};

  const [alojamiento, setAlojamiento] = useState(null);
  const [formulario, setFormulario] = useState({
    fecha_entrada: datosPrevios.fecha_entrada || "",
    fecha_salida: datosPrevios.fecha_salida || "",
    num_huespedes: datosPrevios.num_huespedes || 1,
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
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <section className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-500">Cargando alojamiento...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-start justify-center bg-gray-50 px-4 py-12">
      <section className="fade w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        {/* Encabezado */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Reservar Alojamiento
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Completa los datos para confirmar tu reserva.
          </p>
        </div>

        {/* Resumen del alojamiento */}
        {alojamiento && (
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              {alojamiento.titulo}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {alojamiento.ciudad}, {alojamiento.pais}
            </p>
            <strong className="text-[#e03150] text-base">
              ${alojamiento.precio_por_noche} / noche
            </strong>
          </div>
        )}

        {/* Formulario */}
        <form className="flex flex-col gap-5" onSubmit={crearReserva}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
              Fecha de entrada
              <input
                type="date"
                name="fecha_entrada"
                value={formulario.fecha_entrada}
                onChange={manejarCambio}
                required
                className="font-normal border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#ec4f70] focus:ring-2 focus:ring-[#ec4f70]/20 transition"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
              Fecha de salida
              <input
                type="date"
                name="fecha_salida"
                value={formulario.fecha_salida}
                onChange={manejarCambio}
                required
                className="font-normal border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#ec4f70] focus:ring-2 focus:ring-[#ec4f70]/20 transition"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
            Número de huéspedes
            <input
              type="number"
              name="num_huespedes"
              min="1"
              value={formulario.num_huespedes}
              onChange={manejarCambio}
              required
              className="font-normal border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#ec4f70] focus:ring-2 focus:ring-[#ec4f70]/20 transition"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
            Notas para el anfitrión
            <textarea
              name="notas_huesped"
              value={formulario.notas_huesped}
              onChange={manejarCambio}
              placeholder="Ejemplo: llegaremos por la tarde."
              rows="4"
              className="font-normal border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#ec4f70] focus:ring-2 focus:ring-[#ec4f70]/20 transition resize-y"
            />
          </label>

          {error && (
            <p className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-3.5 py-2.5 text-sm">
              {mensaje}
            </p>
          )}

          {resumen && (
            <div className="bg-blue-50 border border-dashed border-[#ec4f70] rounded-xl px-5 py-4 flex flex-col gap-2">
              <p className="flex justify-between text-sm text-gray-500">
                <span>ID reserva:</span>
                <strong className="text-gray-800">{resumen.id_reserva}</strong>
              </p>
              <p className="flex justify-between text-sm text-gray-500">
                <span>Noches:</span>
                <strong className="text-gray-800">{resumen.noches}</strong>
              </p>
              <p className="flex justify-between text-sm text-gray-500">
                <span>Total:</span>
                <strong className="text-gray-800">${resumen.precio_total}</strong>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="bg-[#ec4f70] text-white font-semibold text-sm rounded-full px-5 py-3 disabled:bg-[#f3a5b4] disabled:cursor-not-allowed transition"
          >
            {cargando ? "Creando reserva..." : "Confirmar reserva"}
          </button>
        </form>

        {/* Enlaces */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 text-sm font-semibold">
          <Link to="/" className="text-[#e03150] hover:underline">
            Volver al inicio
          </Link>
          <Link to="/mis-reservas" className="text-[#e03150] hover:underline">
            Ver mis reservas
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Reserva;