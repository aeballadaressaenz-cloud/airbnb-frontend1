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

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "8px",
    border: "1.5px solid #e0e0e0", fontSize: "14px",
    fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box"
  };

  const labelStyle = {
    display: "block", fontSize: "13px", fontWeight: "600",
    marginBottom: "6px", color: "#374151"
  };

  if (cargando) return <p style={{ textAlign: "center", marginTop: "40px" }}>Cargando...</p>;

  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "calc(100vh - 80px)", padding: "40px 20px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "40px 36px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "700", color: "#111" }}>Editar perfil</h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Actualizá tu información personal</p>
          </div>

          {exito && (
            <div style={{ backgroundColor: "#f0fdf4", color: "#16a34a", padding: "10px 14px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", fontWeight: "500", border: "1px solid #bbf7d0" }}>
              Cambios guardados correctamente. Redirigiendo...
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: "#fff0f3", color: "#FF385C", padding: "10px 14px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", border: "1px solid #ffd6de" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Nombre</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Apellido</label>
              <input type="text" name="apellido" value={form.apellido} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Teléfono</label>
              <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Tu número de teléfono" style={inputStyle} />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Foto de perfil</label>
              <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />
              {preview && (
                <div style={{ marginTop: "12px" }}>
                  <img src={preview} alt="Preview" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" onClick={() => navigate("/perfil")}
                style={{ flex: 1, padding: "13px", backgroundColor: "#fff", color: "#111", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Cancelar
              </button>
              <button type="submit" disabled={guardando}
                style={{ flex: 1, padding: "13px", backgroundColor: "#FF385C", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
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
