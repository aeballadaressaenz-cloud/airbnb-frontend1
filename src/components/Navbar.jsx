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
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 12px',
      borderBottom: '1px solid #e0e0e0',
      position: 'relative'
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={logo} alt="nomada" style={{ height: '35px', width: 'auto', cursor: 'pointer' }} />
      </Link>

      {/* Buscador centrado */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        border: '1px solid #e0e0e0',
        borderRadius: '24px',
        padding: '6px 12px',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '55%'
      }}>
        <span style={{ fontSize: '14px', color: '#555', whiteSpace: 'nowrap' }}>
          En cualquier lugar
        </span>
        <span style={{ color: '#e0e0e0' }}>|</span>
        <input
          type="text"
          placeholder="Buscar destino..."
          onChange={(e) => onBusqueda(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            width: '130px',
            backgroundColor: 'transparent'
          }}
        />
        <div style={{
          backgroundColor: '#FF385C',
          borderRadius: '50%',
          width: '26px',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0
        }}>
          <CiSearch size={18} color="#fdfdfd" />
        </div>
      </div>

      {/* Menú + Login/Logout */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid #e0e0e0',
        borderRadius: '24px',
        padding: '5px 10px',
        flexShrink: 0,
        position: 'relative'
      }}>
        <span style={{ fontSize: '16px' }}>☰</span>
        <IoPersonCircleSharp
          size={28}
          color="#717171"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpenMenu(!openMenu)}
        />

        {!isLoggedIn ? (
          <button
            onClick={handleLoginClick}
            style={{
              backgroundColor: '#FF385C',
              color: '#fff',
              borderRadius: '12px',
              padding: '4px 10px',
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Iniciar sesión
          </button>
        ) : (
          openMenu && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: '160px',
              zIndex: 10
            }}>
              <Link to="/perfil" style={{ padding: '10px', textDecoration: 'none', color: '#111' }}>Perfil</Link>

              {rol === "huesped" && (
                <Link to="/reservas" style={{ padding: '10px', textDecoration: 'none', color: '#111' }}>Mis reservas</Link>
              )}

              {rol === "anfitrion" && (
                <>
                  <Link to="/mis-alojamientos" style={{ padding: '10px', textDecoration: 'none', color: '#111' }}>Mis alojamientos</Link>
                  <Link to="/publicar" style={{ padding: '10px', textDecoration: 'none', color: '#111' }}>Publicar alojamiento</Link>
                </>
              )}

              {rol === "admin" && (
                <>
                  <Link to="/admin/usuarios" style={{ padding: '10px', textDecoration: 'none', color: '#111' }}>Gestionar usuarios</Link>
                  <Link to="/admin/alojamientos" style={{ padding: '10px', textDecoration: 'none', color: '#111' }}>Gestionar alojamientos</Link>
                  <Link to="/admin/reportes" style={{ padding: '10px', textDecoration: 'none', color: '#111' }}>Reportes</Link>
                </>
              )}

              <button
                onClick={handleLogout}
                style={{
                  padding: '10px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#111'
                }}
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
