import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [fotoError, setFotoError] = useState(false);
  const [reservas, setReservas] = useState([]);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get(`${BASE_URL}/api/reservas/historial`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setReservas(res.data))
    .catch(() => setReservas([]));
  }, []);

  if (!usuario) {
    return <p className="text-center mt-10">No hay datos de usuario</p>;
  }

  // Cache-busting: evita que el navegador muestre la foto vieja en caché
  // después de editarla. Si tu API devuelve un campo tipo updated_at o
  // foto_actualizada_en, usalo acá en vez de Date.now() para que la URL
  // solo cambie cuando la foto realmente cambió.
  const fotoUrl = `${BASE_URL}/api/usuarios/${usuario.id_usuario}/foto?t=${usuario.foto_actualizada_en || Date.now()}`;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] px-5 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Banner */}
          <div className="h-24 bg-gradient-to-br from-[#FF385C] to-[#ff6b81]" />

          {/* Avatar y nombre */}
          <div className="px-8 pb-8 relative">
            <div className="w-20 h-20 rounded-full bg-[#FF385C] flex items-center justify-center text-2xl font-bold text-white border-4 border-white relative -top-10 -mb-5 overflow-hidden">
              {usuario.id_usuario && !fotoError ? (
                <img
                  src={fotoUrl}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                  onError={() => setFotoError(true)}
                />
              ) : (
                usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "?"
              )}
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h2 className="mb-1 text-xl font-bold text-gray-900">
                  {usuario.nombre} {usuario.apellido || ""}
                </h2>
                <p className="text-gray-500 text-sm">{usuario.email}</p>
                <span className="inline-block mt-2 bg-[#fff0f3] text-[#FF385C] px-3 py-0.5 rounded-full text-xs font-semibold border border-[#ffd6de]">
                  {usuario.rol}
                </span>
              </div>
              <Link
                to="/editar-perfil"
                className="px-5 py-2.5 bg-white text-gray-900 border-[1.5px] border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
              >
                Editar perfil
              </Link>
            </div>
          </div>
        </div>

        {/* Info personal */}
        <div className="bg-white rounded-2xl shadow-lg px-8 py-7 mt-5">
          <h3 className="mb-4 text-base font-bold text-gray-900">
            Información personal
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1 text-xs text-gray-400 font-semibold uppercase tracking-wide">Nombre</p>
              <p className="text-sm text-gray-900 font-medium">{usuario.nombre} {usuario.apellido || ""}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-400 font-semibold uppercase tracking-wide">Correo</p>
              <p className="text-sm text-gray-900 font-medium">{usuario.email}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-400 font-semibold uppercase tracking-wide">Teléfono</p>
              <p className={`text-sm font-medium ${usuario.telefono ? "text-gray-900" : "text-gray-400"}`}>
                {usuario.telefono || "No agregado"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-400 font-semibold uppercase tracking-wide">Rol</p>
              <p className="text-sm text-gray-900 font-medium capitalize">{usuario.rol}</p>
            </div>
          </div>
        </div>

        {/* Sección según rol */}
        {usuario.rol === "huesped" && (
          <div className="bg-white rounded-2xl shadow-lg px-8 py-7 mt-5">
            <h3 className="mb-2 text-base font-bold text-gray-900">Mis reservas</h3>

            {reservas.length === 0 ? (
              <>
                <p className="mb-4 text-gray-500 text-sm">
                  Todavía no tenés reservas activas. Explorá destinos y encontrá tu próximo alojamiento.
                </p>
                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-[#FF385C] text-white rounded-lg text-sm font-semibold hover:bg-[#e03150] transition"
                >
                  Explorar alojamientos
                </Link>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2.5 mb-4">
                  {reservas.slice(0, 2).map((reserva) => (
                    <div
                      key={reserva.id_reserva}
                      className="flex justify-between items-center px-3.5 py-3 border border-gray-100 rounded-xl"
                    >
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          {reserva.alojamiento}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {new Date(reserva.fecha_entrada).toLocaleDateString("es-NI")} → {new Date(reserva.fecha_salida).toLocaleDateString("es-NI")}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 capitalize">
                        {reserva.estado}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/mis-reservas"
                  className="inline-block px-6 py-3 bg-[#FF385C] text-white rounded-lg text-sm font-semibold hover:bg-[#e03150] transition"
                >
                  Ver todas mis reservas
                </Link>
              </>
            )}
          </div>
        )}

        {usuario.rol === "anfitrion" && (
          <div className="bg-white rounded-2xl shadow-lg px-8 py-7 mt-5">
            <h3 className="mb-2 text-base font-bold text-gray-900">Mis alojamientos</h3>
            <p className="mb-4 text-gray-500 text-sm">
              Administrá tus propiedades y revisá las reservas de tus huéspedes.
            </p>
            <Link
              to="/mis-alojamientos"
              className="inline-block px-6 py-3 bg-[#FF385C] text-white rounded-lg text-sm font-semibold hover:bg-[#e03150] transition"
            >
              Ver mis propiedades
            </Link>
          </div>
        )}

        {usuario.rol === "admin" && (
          <div className="bg-white rounded-2xl shadow-lg px-8 py-7 mt-5">
            <h3 className="mb-2 text-base font-bold text-gray-900">Panel de administración</h3>
            <p className="mb-4 text-gray-500 text-sm">
              Tenés acceso completo a la plataforma. Gestioná usuarios, alojamientos y reservas.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
            >
              Ir al panel
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default Perfil;