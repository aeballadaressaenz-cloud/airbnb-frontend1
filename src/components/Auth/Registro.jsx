import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    rol: "huesped"   // valor por defecto
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const validar = () => {
    const e = {};
    if (!form.nombre) e.nombre = "El nombre es requerido";
    if (!form.apellido) e.apellido = "El apellido es requerido";
    if (!form.correo) e.correo = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(form.correo)) e.correo = "Correo inválido";
    if (!form.contrasena) e.contrasena = "La contraseña es requerida";
    else if (form.contrasena.length < 6) e.contrasena = "Mínimo 6 caracteres";
    if (!form.rol) e.rol = "El rol es requerido";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresValidacion = validar();
    if (Object.keys(erroresValidacion).length > 0) { setErrores(erroresValidacion); return; }
    setCargando(true);
    setErrorGeneral(null);
    try {
      await axios.post(`${BASE_URL}/api/usuarios/registro`, {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.correo,
        password: form.contrasena,
        telefono: form.telefono,
        rol: form.rol   // dinámico: huésped o anfitrión
      });
      navigate("/login");
    } catch (err) {
      setErrorGeneral(err.response?.data?.mensaje || "Error al registrarse, intentá de nuevo");
    } finally {
      setCargando(false);
    }
  };

  const inputStyle = (campo) => ({
    width: "100%", padding: "12px", boxSizing: "border-box", outline: "none",
    border: `1.5px solid ${errores[campo] ? "#FF385C" : "#e0e0e0"}`, borderRadius: "8px", fontSize: "14px"
  });

  const labelStyle = { display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px", color: "#111" };
  const errorStyle = { color: "#FF385C", fontSize: "12px", marginTop: "4px" };

  return (
    <div className="background-airbnb">
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "60px" }}>
        {/* Card a la derecha */}
        <div style={{
          background: "#ffffff",
          padding: "28px 40px",
          borderRadius: "14px",
          boxShadow: "0 3px 18px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "600px"
        }}>
          <h2 style={{
            textAlign: "center",
            marginBottom: "18px",
            color: "#111111",
            fontSize: "24px",
            fontWeight: "700"
          }}>
            Crear cuenta
          </h2>

          {errorGeneral && (
            <div style={{ backgroundColor: "#fff0f3", color: "#FF385C", padding: "10px 14px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px" }}>
              {errorGeneral}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Grid de dos columnas */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" style={inputStyle("nombre")} />
                {errores.nombre && <p style={errorStyle}>{errores.nombre}</p>}
              </div>

              <div>
                <label style={labelStyle}>Apellido</label>
                <input type="text" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Tu apellido" style={inputStyle("apellido")} />
                {errores.apellido && <p style={errorStyle}>{errores.apellido}</p>}
              </div>

              <div>
                <label style={labelStyle}>Correo electrónico</label>
                <input type="email" name="correo" value={form.correo} onChange={handleChange} placeholder="tu@correo.com" style={inputStyle("correo")} />
                {errores.correo && <p style={errorStyle}>{errores.correo}</p>}
              </div>

              <div>
                <label style={labelStyle}>Teléfono <span style={{ color: "#9ca3af", fontWeight: "400" }}>(opcional)</span></label>
                <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Tu número" style={inputStyle("telefono")} />
              </div>
            </div>

            {/* Rol y contraseña en filas completas */}
            <div style={{ marginTop: "16px" }}>
              <label style={labelStyle}>Rol</label>
              <select name="rol" value={form.rol} onChange={handleChange} style={inputStyle("rol")}>
                <option value="huesped">Huésped</option>
                <option value="anfitrion">Anfitrión</option>
              </select>
              {errores.rol && <p style={errorStyle}>{errores.rol}</p>}
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={labelStyle}>Contraseña</label>
              <input type="password" name="contrasena" value={form.contrasena} onChange={handleChange} placeholder="Mínimo 6 caracteres" style={inputStyle("contrasena")} />
              {errores.contrasena && <p style={errorStyle}>{errores.contrasena}</p>}
            </div>

            <button type="submit" disabled={cargando}
              style={{ width: "100%", marginTop: "20px", padding: "14px", backgroundColor: "#FF385C", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "16px" }}>
              {cargando ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "22px", color: "#6b7280", fontSize: "14px" }}>
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" style={{ color: "#FF385C", textDecoration: "none", fontWeight: "600" }}>Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registro;
