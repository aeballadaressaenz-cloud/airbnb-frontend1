import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

function MisAlojamientos() {
  const [alojamientos, setAlojamientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const obtenerMisAlojamientos = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/alojamientos/mis-alojamientos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAlojamientos(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudieron cargar tus alojamientos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerMisAlojamientos();
  }, []);

  const eliminarAlojamiento = async (id) => {
    const confirmar = window.confirm("Seguro que queres eliminar este alojamiento?");
    if (!confirmar) return;

    setEliminando(id);
    setError(null);
    setMensaje("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/alojamientos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje("Alojamiento eliminado exitosamente.");
      await obtenerMisAlojamientos();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo eliminar el alojamiento.");
    } finally {
      setEliminando(null);
    }
  };

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <section className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-500">Cargando tus alojamientos...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-start justify-center bg-gray-50 px-4 py-12">
      <section className="fade w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 pb-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mis alojamientos</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestiona tus propiedades publicadas.
            </p>
          </div>
          <Link
            to="/publicar"
            className="bg-[#FF385C] text-white font-semibold text-sm rounded-full px-4 py-2 hover:bg-[#e03150] transition whitespace-nowrap"
          >
            + Publicar nuevo
          </Link>
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

        {alojamientos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Todavía no publicaste ningún alojamiento.</p>
            <Link
              to="/publicar"
              className="inline-block mt-3 text-[#e03150] font-semibold hover:underline"
            >
              Publicar mi primer alojamiento
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {alojamientos.map((aloj) => (
              <article
                className="border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 transition hover:shadow-md hover:-translate-y-0.5"
                key={aloj.id_alojamiento}
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{aloj.titulo}</h2>
                  <p className="text-gray-500 text-sm">
                    {aloj.ciudad} - {aloj.tipo_alojamiento} - ${aloj.precio_por_noche}/noche
                  </p>
                  <span
                    className={`inline-block mt-1.5 text-xs font-semibold rounded-full px-2.5 py-0.5 border ${
                      aloj.activo ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {aloj.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    to={`/alojamiento/${aloj.id_alojamiento}`}
                    className="bg-white text-gray-800 border border-gray-300 font-semibold text-sm rounded-full px-4 py-2 hover:bg-gray-50 transition"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/editar-alojamiento/${aloj.id_alojamiento}`}
                    className="bg-white text-gray-800 border border-gray-300 font-semibold text-sm rounded-full px-4 py-2 hover:bg-gray-50 transition"
                  >
                    Editar
                  </Link>
                  {aloj.activo && (
                    <button
                      type="button"
                      onClick={() => eliminarAlojamiento(Number(aloj.id_alojamiento))}
                      disabled={eliminando === aloj.id_alojamiento}
                      className="bg-[#ec4f70] text-white font-semibold text-sm rounded-full px-4 py-2 disabled:bg-[#f3a5b4] disabled:cursor-not-allowed transition"
                    >
                      {eliminando === aloj.id_alojamiento ? "Eliminando..." : "Eliminar"}
                    </button>
                  )}
                </div>
              </article>
            ))}
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

export default MisAlojamientos;