import logo from '../assets/logof.png';
import { IoPersonCircleSharp } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";


function Navbar({ onBusqueda }) {
  return (
    <nav style={{
       display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
     padding: '10px 12px',
     borderBottom: '1px solid #e0e0e0',
      position: 'relative'
    }}>
      <img
        src={logo}
        alt="nomada"
        style={{ height: '35px', width: 'auto' }}
      />

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

      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      border: '1px solid #e0e0e0',
      borderRadius: '24px',
      padding: '5px 10px',
      cursor: 'pointer',
      flexShrink: 0
      }}>
        <span style={{ fontSize: '16px' }}>☰</span>
        <IoPersonCircleSharp size={28} color="#717171" />
      </div>
    </nav>
  );
}

export default Navbar;