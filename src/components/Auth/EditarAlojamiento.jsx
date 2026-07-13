import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

function EditarAlojamiento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ciudades, setCiudades] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo_alojamiento: "apartamento",
    precio_por_noche: "",
    capacidad_personas: "",
    num_habitaciones: "",
    num_banos: "",
    direccion: ""
  });
  const [imagenes, setImagenes] = useState([]);
  const [fotosNuevas, setFotosNuevas] = useState([]);
  const [subiendoFotos, setSubiendoFotos] = useState(false);
  const [errorFotos, setErrorFotos] = useState(null);
  const [mensajeFotos, setMensajeFotos] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const cargarAlojamiento = () => {
    axios.get(`${BASE_URL}/api/alojamientos/${id}`)
      .then((res) => {
        const a = res.data.alojamiento;
        setForm({
          titulo: a.titulo || "",
          descripcion: a.descripcion || "",
          tipo_alojamiento: a.tipo_alojamiento || "apartamento",
          precio_por_noche: a.precio_por_noche || "",
          capacidad_personas: a.capacidad_personas || "",
          num_habitaciones: a.num_habitaciones || "",
          num_banos: a.num_banos || "",
          direccion: a.direccion || ""
        });
        setImagenes(res.data.imagenes || []);
        setCargando(false);
      })
      .catch(() => {
        setError("No se pudo cargar la información del alojamiento.");
        setCargando(false);
      });
  };

  useEffect(() => {
    axios.get(`${BASE_URL}/api/ciudades`)
      .then(res => setCiudades(res.data))
      .catch(() => setCiudades([]));

    cargarAlojamiento();
  }, [id]);

  const handleSubirFotos = async () => {
    if (fotosNuevas.length === 0) return;
    setSubiendoFotos(true);
    setErrorFotos(null);
    setMensajeFotos("");
    try {
      const token = localStorage.getItem("token");
      const yaTieneFotos = imagenes.length > 0;

      for (let i = 0; i < fotosNuevas.length; i++) {
        const formData = new FormData();
        formData.append("imagen", fotosNuevas[i]);
        formData.append("es_principal", !yaTieneFotos && i === 0 ? 1 : 0);
        formData.append("orden", imagenes.length + i);
        await axios.post(
          `${BASE_URL}/api/alojamientos/${id}/imagenes`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setMensajeFotos("Fotos subidas exitosamente.");
      setFotosNuevas([]);
      cargarAlojamiento();
    } catch (err) {
      setErrorFotos(err.response?.data?.error || "No se pudieron subir las fotos.");
    } finally {
      setSubiendoFotos(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setMensaje("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/alojamientos/${id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("Alojamiento actualizado exitosamente.");
      setTimeout(() => navigate("/mis-alojamientos"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo actualizar el alojamiento.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <section className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-500">Cargando alojamiento...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-start justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Editar alojamiento</h1>
          <p className="text-gray-500 text-sm mt-1">
            Actualizá los datos de tu propiedad.
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título</label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
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
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              placeholder="Contá qué hace especial a tu alojamiento"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo de alojamiento</label>
            <select
              name="tipo_alojamiento"
              value={form.tipo_alojamiento}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
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
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
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
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
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
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
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
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
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
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 bg-[#FF385C] text-white font-semibold text-sm rounded-full px-4 py-3 hover:bg-[#e03150] transition disabled:bg-[#f3a5b4] disabled:cursor-not-allowed"
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
            <Link
              to="/mis-alojamientos"
              className="flex-1 text-center bg-white text-gray-800 border border-gray-300 font-semibold text-sm rounded-full px-4 py-3 hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Fotos</h2>
          <p className="text-gray-500 text-sm mb-4">
            {imagenes.length === 0
              ? "Este alojamiento todavía no tiene fotos. Subí al menos una."
              : `Este alojamiento tiene ${imagenes.length} foto(s).`}
          </p>

          {imagenes.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {imagenes.map((img) => (
                <img
                  key={img.id_imagen}
                  src={`${BASE_URL}/api/alojamientos/${id}/imagenes/${img.id_imagen}`}
                  alt="Foto del alojamiento"
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
              ))}
            </div>
          )}

          {errorFotos && (
            <p className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm mb-3">
              {errorFotos}
            </p>
          )}
          {mensajeFotos && (
            <p className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-3.5 py-2.5 text-sm mb-3">
              {mensajeFotos}
            </p>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFotosNuevas(Array.from(e.target.files))}
            className="text-sm mb-3 block"
          />

          <button
            type="button"
            onClick={handleSubirFotos}
            disabled={subiendoFotos || fotosNuevas.length === 0}
            className="bg-white text-gray-800 border border-gray-300 font-semibold text-sm rounded-full px-4 py-2.5 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {subiendoFotos ? "Subiendo..." : "Subir fotos"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default EditarAlojamiento;