import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    email: "",
    password: "",
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

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setCargando(true);
    setMensaje("");
    setError("");

    try {
      const respuesta = await api.post("/usuarios/login", formulario);

      localStorage.setItem("token", respuesta.data.token);
      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));

      setMensaje("Inicio de sesión exitoso.");

      setTimeout(() => {
        navigate("/perfil");
      }, 700);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo iniciar sesión.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <h1>Iniciar sesión</h1>
          <p>Accede a tu cuenta para gestionar reservas y valoraciones.</p>
        </div>

        <form className="auth-form" onSubmit={iniciarSesion}>
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
              placeholder="Tu contraseña"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {mensaje && <p className="auth-success">{mensaje}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;