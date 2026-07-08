import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const BASE_URL = "http://localhost:3000";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  console.log("useAuth:", useAuth());


  const validar = () => {
    const nuevosErrores = {};
    if (!form.email) nuevosErrores.email = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(form.email)) nuevosErrores.email = "Correo inválido";
    if (!form.password) nuevosErrores.password = "La contraseña es requerida";
    return nuevosErrores;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresValidacion = validar();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    setCargando(true);
    setErrorGeneral(null);
    try {
      const res = await axios.post(`${BASE_URL}/api/usuarios/login`, form);
      login(res.data.usuario, res.data.token);
      navigate("/");
    } catch (err) {
      setErrorGeneral(err.response?.data?.mensaje || "Correo o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="background-airbnb">
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Card de login */}
        <div style={{
          background: "#ffffff",
          padding: "28px 40px",
          borderRadius: "14px",
          boxShadow: "0 3px 18px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "420px"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: "18px", color: "#111111", fontSize: "24px", fontWeight: "700" }}>
            Bienvenido de vuelta
          </h2>

          {errorGeneral && (
            <div style={{ backgroundColor: "#fff0f3", color: "#FF385C", padding: "10px 14px", borderRadius: "8px", marginBottom: "20px" }}>
              {errorGeneral}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              style={{ width: "100%", marginBottom: "12px", padding: "12px", border: "1px solid #e0e0e0", borderRadius: "8px" }}
            />
            {errores.email && <p style={{ color: "#FF385C" }}>{errores.email}</p>}

            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              style={{ width: "100%", marginBottom: "12px", padding: "12px", border: "1px solid #e0e0e0", borderRadius: "8px" }}
            />
            {errores.password && <p style={{ color: "#FF385C" }}>{errores.password}</p>}

            <button
              type="submit"
              disabled={cargando}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#FF385C",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "15px"
              }}
            >
              {cargando ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "22px", color: "#6b7280", fontSize: "13px" }}>
            ¿No tenés cuenta?{" "}
            <Link to="/registro" style={{ color: "#FF385C", textDecoration: "none", fontWeight: "600" }}>
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;