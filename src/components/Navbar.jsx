import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logof.png";
import { IoPersonCircleSharp } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useAuth } from "../Context/AuthContext";

function Navbar({ onBusqueda }) {
  const { usuario, isLoggedIn, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const rol = usuario?.rol || null;

  const handleLogout = () => {
    logout();
    setOpenMenu(false);
    navigate("/login");
  };

  const handleLoginClick = () => {
    setOpenMenu(false);
    navigate("/login");
  };

  return (
    <nav className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-2 px-3 py-2.5 border-b border-gray-200 relative">
      {/* Logo */}
      <Link to="/" className="flex items-center no-underline order-1">
        <img src={logo} alt="nomada" style={{ height: '35px', width: 'auto', cursor: 'pointer' }} />
      </Link>

      {/* Buscador: en móvil pasa a ocupar todo el ancho y va debajo; en md+ vuelve a quedar centrado */}
      <div
        className="order-3 md:order-2 w-full md:w-auto mt-2 md:mt-0 md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 md:max-w-[55%]"
      >
        <span className="text-sm text-gray-600 whitespace-nowrap">
          En cualquier lugar
        </span>
        <span className="text-gray-200">|</span>
        <input
          type="text"
          placeholder="Buscar destino..."
          onChange={(e) => onBusqueda(e.target.value)}
          className="border-none outline-none text-[13px] bg-transparent flex-1 min-w-0"
        />
        <div
          className="rounded-full flex items-center justify-center cursor-pointer shrink-0"
          style={{ backgroundColor: '#FF385C', width: '26px', height: '26px' }}
        >
          <CiSearch size={18} color="#fdfdfd" />
        </div>
      </div>

      {/* Menú + Login/Logout */}
      <div className="order-2 md:order-3 ml-auto md:ml-0 flex items-center gap-2 border border-gray-200 rounded-full px-2.5 py-1.5 shrink-0 relative">
        <span className="text-base">☰</span>
        <IoPersonCircleSharp
          size={28}
          color="#717171"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpenMenu(!openMenu)}
        />

        {!isLoggedIn ? (
          <button
            onClick={handleLoginClick}
            className="text-white rounded-xl text-[13px] border-none cursor-pointer"
            style={{ backgroundColor: '#FF385C', padding: '4px 10px' }}
          >
            Iniciar sesión
          </button>
        ) : (
          openMenu && (
            <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col min-w-[160px] z-10">
              <Link to="/perfil" className="px-2.5 py-2.5 no-underline text-gray-900 hover:bg-gray-50">Perfil</Link>

              {rol === "huesped" && (
                <Link to="/mis-reservas" className="px-2.5 py-2.5 no-underline text-gray-900 hover:bg-gray-50">Mis reservas</Link>
              )}

              {rol === "anfitrion" && (
                <>
                  <Link to="/mis-alojamientos" className="px-2.5 py-2.5 no-underline text-gray-900 hover:bg-gray-50">Mis alojamientos</Link>
                  <Link to="/publicar" className="px-2.5 py-2.5 no-underline text-gray-900 hover:bg-gray-50">Publicar alojamiento</Link>
                </>
              )}

              {rol === "admin" && (
                <>
                  <Link to="/admin/usuarios" className="px-2.5 py-2.5 no-underline text-gray-900 hover:bg-gray-50">Gestionar usuarios</Link>
                  <Link to="/admin/alojamientos" className="px-2.5 py-2.5 no-underline text-gray-900 hover:bg-gray-50">Gestionar alojamientos</Link>
                  <Link to="/admin/reportes" className="px-2.5 py-2.5 no-underline text-gray-900 hover:bg-gray-50">Reportes</Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="px-2.5 py-2.5 border-none bg-transparent text-left cursor-pointer text-gray-900 hover:bg-gray-50 rounded-b-lg"
              >
                Cerrar sesión
              </button>
            </div>
          )
        )}
      </div>
    </nav>
  );
}

export default Navbar;