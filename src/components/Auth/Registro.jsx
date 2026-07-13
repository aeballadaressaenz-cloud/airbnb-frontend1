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

  const inputClass = (campo) =>
    `w-full px-3 py-3 box-border outline-none rounded-lg text-sm border-[1.5px] ${
      errores[campo] ? "border-[#FF385C]" : "border-gray-200"
    }`;

  return (
    <div className="background-airbnb">
      <div className="min-h-screen flex items-center justify-end pr-16">
        {/* Card a la derecha */}
        <div className="bg-white px-10 py-7 rounded-2xl shadow-lg w-full max-w-xl">
          <h2 className="text-center mb-4 text-gray-900 text-2xl font-bold">
            Crear cuenta
          </h2>

          {errorGeneral && (
            <div className="bg-[#fff0f3] text-[#FF385C] px-3.5 py-2.5 rounded-lg mb-5 text-sm">
              {errorGeneral}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Grid de dos columnas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-900">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className={inputClass("nombre")}
                />
                {errores.nombre && <p className="text-[#FF385C] text-xs mt-1">{errores.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-900">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  className={inputClass("apellido")}
                />
                {errores.apellido && <p className="text-[#FF385C] text-xs mt-1">{errores.apellido}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-900">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  className={inputClass("correo")}
                />
                {errores.correo && <p className="text-[#FF385C] text-xs mt-1">{errores.correo}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-900">
                  Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Tu número"
                  className={inputClass("telefono")}
                />
              </div>
            </div>

            {/* Rol y contraseña en filas completas */}
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-1.5 text-gray-900">Rol</label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className={inputClass("rol")}
              >
                <option value="huesped">Huésped</option>
                <option value="anfitrion">Anfitrión</option>
              </select>
              {errores.rol && <p className="text-[#FF385C] text-xs mt-1">{errores.rol}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-1.5 text-gray-900">Contraseña</label>
              <input
                type="password"
                name="contrasena"
                value={form.contrasena}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className={inputClass("contrasena")}
              />
              {errores.contrasena && <p className="text-[#FF385C] text-xs mt-1">{errores.contrasena}</p>}
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full mt-5 py-3.5 bg-[#FF385C] text-white rounded-lg font-semibold text-base hover:bg-[#e03150] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {cargando ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center mt-5 text-gray-500 text-sm">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-[#FF385C] no-underline font-semibold">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registro;