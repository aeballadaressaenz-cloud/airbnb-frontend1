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
      <div className="min-h-screen flex items-center justify-center">
        {/* Card de login */}
        <div className="bg-white px-10 py-7 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-center mb-4 text-gray-900 text-2xl font-bold">
            Bienvenido de vuelta
          </h2>

          {errorGeneral && (
            <div className="bg-[#fff0f3] text-[#FF385C] px-3.5 py-2.5 rounded-lg mb-5">
              {errorGeneral}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              className="w-full mb-3 px-3 py-3 border border-gray-200 rounded-lg text-sm outline-none"
            />
            {errores.email && <p className="text-[#FF385C] text-sm">{errores.email}</p>}

            <label className="block text-sm font-semibold mb-1.5 text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              className="w-full mb-3 px-3 py-3 border border-gray-200 rounded-lg text-sm outline-none"
            />
            {errores.password && <p className="text-[#FF385C] text-sm">{errores.password}</p>}

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3.5 bg-[#FF385C] text-white rounded-lg font-bold text-sm hover:bg-[#e03150] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {cargando ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-center mt-5 text-gray-500 text-sm">
            ¿No tenés cuenta?{" "}
            <Link to="/registro" className="text-[#FF385C] no-underline font-semibold">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;