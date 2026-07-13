import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

function EditarPerfil() {
  const [form, setForm] = useState({ nombre: "", apellido: "", telefono: "" });
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    axios.get(`${BASE_URL}/api/usuarios/perfil`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const { nombre, apellido, telefono } = res.data;
      setForm({ nombre: nombre || "", apellido: apellido || "", telefono: telefono || "" });
      setCargando(false);
    })
    .catch(() => { setError("No se pudo cargar el perfil"); setCargando(false); });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      // 1. Actualizar datos de texto
      await axios.put(`${BASE_URL}/api/usuarios/perfil`, {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Subir foto si existe
      if (foto) {
        const formData = new FormData();
        formData.append("foto", foto);
        await axios.put(`${BASE_URL}/api/usuarios/perfil/foto`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      }

      setExito(true);
      setTimeout(() => navigate("/perfil"), 1500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.error || "Error al guardar los cambios");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] px-5 py-10">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg px-9 py-10">
          <div className="mb-7">
            <h2 className="mb-1.5 text-xl font-bold text-gray-900">Editar perfil</h2>
            <p className="text-sm text-gray-500">Actualizá tu información personal</p>
          </div>

          {exito && (
            <div className="bg-green-50 text-green-600 px-3.5 py-2.5 rounded-lg mb-5 text-sm font-medium border border-green-200">
              Cambios guardados correctamente. Redirigiendo...
            </div>
          )}

          {error && (
            <div className="bg-[#fff0f3] text-[#FF385C] px-3.5 py-2.5 rounded-lg mb-5 text-sm border border-[#ffd6de]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-3 rounded-lg border-[1.5px] border-gray-200 text-sm outline-none box-border"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-lg border-[1.5px] border-gray-200 text-sm outline-none box-border"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Tu número de teléfono"
                className="w-full px-3.5 py-3 rounded-lg border-[1.5px] border-gray-200 text-sm outline-none box-border"
              />
            </div>

            <div className="mb-7">
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">Foto de perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3.5 py-3 rounded-lg border-[1.5px] border-gray-200 text-sm outline-none box-border"
              />
              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/perfil")}
                className="flex-1 py-3.5 bg-white text-gray-900 border-[1.5px] border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="flex-1 py-3.5 bg-[#FF385C] text-white rounded-lg text-sm font-semibold hover:bg-[#e03150] transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;