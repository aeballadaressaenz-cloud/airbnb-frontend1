import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Registro() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    rol: "huesped",
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();

    setCargando(true);
    setMensaje("");
    setError("");

    try {
      await api.post("/usuarios/registro", formulario);

      setMensaje("Usuario registrado correctamente.");

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo registrar el usuario.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-large">
        <div className="auth-header">
          <h1>Crear cuenta</h1>
          <p>Regístrate para reservar alojamientos y dejar valoraciones.</p>
        </div>

        <form className="auth-form" onSubmit={registrarUsuario}>
          <div className="auth-grid">
            <label>
              Nombre
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                placeholder="Tu nombre"
                required
              />
            </label>

            <label>
              Apellido
              <input
                type="text"
                name="apellido"
                value={formulario.apellido}
                onChange={manejarCambio}
                placeholder="Tu apellido"
                required
              />
            </label>
          </div>

          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={manejarCambio}
              placeholder="correo@ejemplo.com"
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              name="password"
              value={formulario.password}
              onChange={manejarCambio}
              placeholder="Crea una contraseña"
              required
            />
          </label>

          <label>
            Teléfono
            <input
              type="tel"
              name="telefono"
              value={formulario.telefono}
              onChange={manejarCambio}
              placeholder="Opcional"
            />
          </label>

          <label>
            Tipo de usuario
            <select name="rol" value={formulario.rol} onChange={manejarCambio}>
              <option value="huesped">Huésped</option>
              <option value="anfitrion">Anfitrión</option>
              <option value="ambos">Ambos</option>
            </select>
          </label>

          {error && <p className="auth-error">{error}</p>}
          {mensaje && <p className="auth-success">{mensaje}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}

export default Registro;