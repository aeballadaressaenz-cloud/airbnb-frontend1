import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

function PublicarAlojamiento() {
  const navigate = useNavigate();

  const [ciudades, setCiudades] = useState([]);
  const [amenidades, setAmenidades] = useState([]);
  const [amenidadesSeleccionadas, setAmenidadesSeleccionadas] = useState([]);
  const [form, setForm] = useState({
    id_ciudad: "",
    titulo: "",
    descripcion: "",
    tipo_alojamiento: "apartamento",
    precio_por_noche: "",
    capacidad_personas: "",
    num_habitaciones: "",
    num_banos: "",
    direccion: ""
  });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [idAlojamientoCreado, setIdAlojamientoCreado] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [subiendoFotos, setSubiendoFotos] = useState(false);
  const [errorFotos, setErrorFotos] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/ciudades`)
      .then(res => setCiudades(res.data))
      .catch(() => setCiudades([]));

    axios.get(`${BASE_URL}/api/amenidades`)
      .then(res => setAmenidades(res.data))
      .catch(() => setAmenidades([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleAmenidad = (id) => {
    setAmenidadesSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/alojamientos`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIdAlojamientoCreado(res.data.id_alojamiento);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo publicar el alojamiento.");
    } finally {
      setCargando(false);
    }
  };

  const handleSubirFotos = async () => {
    setSubiendoFotos(true);
    setErrorFotos(null);
    try {
      const token = localStorage.getItem("token");

      for (let i = 0; i < fotos.length; i++) {
        const formData = new FormData();
        formData.append("imagen", fotos[i]);
        formData.append("es_principal", i === 0 ? 1 : 0);
        formData.append("orden", i);
        await axios.post(
          `${BASE_URL}/api/alojamientos/${idAlojamientoCreado}/imagenes`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (amenidadesSeleccionadas.length > 0) {
        await axios.post(
          `${BASE_URL}/api/alojamientos/${idAlojamientoCreado}/amenidades`,
          { id_amenidades: amenidadesSeleccionadas },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      navigate(`/alojamiento/${idAlojamientoCreado}`);
    } catch (err) {
      setErrorFotos(err.response?.data?.error || "No se pudo completar la publicación.");
    } finally {
      setSubiendoFotos(false);
    }
  };

  // Paso 2: fotos y amenidades, una vez ya creado el alojamiento
  if (idAlojamientoCreado) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <section className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1.5">
            ¡Alojamiento publicado! 🎉
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Ahora agregá fotos y amenidades para que se vea más atractivo (opcional).
          </p>

          {errorFotos && (
            <p className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm mb-5">
              {errorFotos}
            </p>
          )}

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fotos
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFotos(Array.from(e.target.files))}
            className="text-sm mb-5 block"
          />

          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            Amenidades (opcional)
          </label>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {amenidades.map((a) => (
              <label
                key={a.id_amenidad}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={amenidadesSeleccionadas.includes(a.id_amenidad)}
                  onChange={() => toggleAmenidad(a.id_amenidad)}
                />
                {a.nombre}
              </label>
            ))}
          </div>

          <button
            onClick={handleSubirFotos}
            disabled={subiendoFotos}
            className="w-full bg-[#FF385C] text-white font-semibold text-sm rounded-lg px-4 py-3.5 hover:bg-[#e03150] transition disabled:bg-[#f3a5b4] disabled:cursor-not-allowed"
          >
            {subiendoFotos ? "Guardando..." : "Finalizar publicación"}
          </button>
        </section>
      </main>
    );
  }

  // Paso 1: datos del alojamiento
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-1.5">
          Publicá tu alojamiento
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Completá los datos básicos de tu propiedad.
        </p>

        {error && (
          <p className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm mb-5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título</label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              placeholder="Ej: Apartamento moderno en Managua"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              placeholder="Contá qué hace especial a tu alojamiento"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ciudad</label>
            <select
              name="id_ciudad"
              value={form.id_ciudad}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
            >
              <option value="">Seleccioná una ciudad</option>
              {ciudades.map((c) => (
                <option key={c.id_ciudad} value={c.id_ciudad}>
                  {c.nombre}{c.estado_provincia ? `, ${c.estado_provincia}` : ""} — {c.pais}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo de alojamiento</label>
            <select
              name="tipo_alojamiento"
              value={form.tipo_alojamiento}
              onChange={handleChange}
              className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
            >
              <option value="apartamento">Apartamento</option>
              <option value="casa_completa">Casa completa</option>
              <option value="habitacion_privada">Habitación privada</option>
              <option value="habitacion_compartida">Habitación compartida</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dirección</label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              placeholder="Ej: Carretera Masaya km 6, Managua"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Precio por noche (USD)</label>
              <input
                type="number"
                name="precio_por_noche"
                value={form.precio_por_noche}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
                className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Capacidad (personas)</label>
              <input
                type="number"
                name="capacidad_personas"
                value={form.capacidad_personas}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Habitaciones</label>
              <input
                type="number"
                name="num_habitaciones"
                value={form.num_habitaciones}
                onChange={handleChange}
                min="0"
                className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Baños</label>
              <input
                type="number"
                name="num_banos"
                value={form.num_banos}
                onChange={handleChange}
                min="0"
                className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#FF385C] text-white font-semibold text-sm rounded-lg px-4 py-3.5 hover:bg-[#e03150] transition disabled:bg-[#f3a5b4] disabled:cursor-not-allowed mt-2"
          >
            {cargando ? "Publicando..." : "Publicar alojamiento"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default PublicarAlojamiento;