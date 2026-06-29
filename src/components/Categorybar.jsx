import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import { FaUmbrellaBeach } from "react-icons/fa6";
import { GiMeditation } from "react-icons/gi";
import { GiMountains } from "react-icons/gi";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { GiHouse } from "react-icons/gi";
import { GiMountainClimbing } from "react-icons/gi";




import { useState } from "react";

function Categorybar({ filtroActivo, onFiltroTipo, filtros, onFiltros }) {
  const [mostrarPanel, setMostrarPanel] = useState(false);
const [precioMax, setPrecioMax] = useState(500);
  const [ciudad, setCiudad] = useState(filtros.ciudad);
  const [capacidad, setCapacidad] = useState(filtros.capacidad);

const categorias = [
  { icono: <FaUmbrellaBeach size={32} color="#c5c224"/>, nombre: "Frente al Mar", tipo: "frente_al_mar" },
  { icono: <GiMountains size={32} color="#388038"/>, nombre: "Resorts", tipo: "resorts" },
  { icono: <PiBuildingApartmentFill size={32} color="#72c497fb"/>, nombre: "Apartamentos", tipo: "apartamento" },
  { icono: <GiHouse size={32} color="#da9c3f"/>, nombre: "Propiedades", tipo: "propiedades" },
  { icono: <GiMountainClimbing size={32} color="#a8c72f"/>, nombre: "Experiencias", tipo: "experiencias" },
  { icono: <GiMeditation size={32} color="#d87625"/>, nombre: "Retiros", tipo: "retiros" },
];

  const aplicarFiltros = () => {
    onFiltros({ ciudad, precioMax, capacidad });
    setMostrarPanel(false);
  };

  const limpiarFiltros = () => {
    setCiudad("");
    setPrecioMax(500);
    setCapacidad(0);
    onFiltros({ ciudad: "", precioMax: 500, capacidad: 0 });
    onFiltroTipo("");
    setMostrarPanel(false);
  };

  return (
        <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #e0e0e0',
         gap:'8'
      }}>
        <div style={{
          display: 'flex',
          gap: '32px',
          overflowX: 'auto',
           position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)'
        }}>
          {categorias.map((cat) => (
            <div
              key={cat.nombre}
              onClick={() => onFiltroTipo(filtroActivo === cat.tipo ? "" : cat.tipo)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                minWidth: 'fit-content',
                fontSize: '13px',
                color: filtroActivo === cat.tipo ? '#FF385C' : '#555',
                borderBottom: filtroActivo === cat.tipo ? '2px solid #FF385C' : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '24px' }}>{cat.icono}</span>
              <span>{cat.nombre}</span>
            </div>
          ))}
        </div> 

         <div style={{ marginLeft: 'auto'}}>
        <button
          onClick={() => setMostrarPanel(!mostrarPanel)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '12px 20px',
            cursor: 'pointer',
            backgroundColor: mostrarPanel ? '#f7f7f7' : 'white',
            fontWeight: '600',
            fontSize: '14px',
            flexShrink: 0,
             boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}
        >
          ⚙️ Filtros
        </button>

         </div>
        
      </div>

      {mostrarPanel && (
  <div style={{
    position: 'absolute',
    right: '24px',
    top: '80px',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '16px',
    padding: '24px',
    width: '320px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    zIndex: 100
  }}>
    <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '20px' }}>
      Destino
    </h3>

    {/* Ciudad */}
    <div style={{ marginBottom: '24px' }}>
      <TextField
        label="Ciudad / País"
        placeholder="Ej: México, Colombia..."
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
        fullWidth
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          }
        }}
      />
    </div>

    {/* Precio */}
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontWeight: '600', fontSize: '16px', marginBottom: '20px' }}>
        Precio máximo: <span style={{ color: '#FF385C' }}>${precioMax}</span>
      </p>
      <Slider
        value={precioMax}
        onChange={(e, newValue) => setPrecioMax(newValue)}
        min={20}
        max={500}
        sx={{
          color: '#FF385C',
          '& .MuiSlider-thumb': {
            backgroundColor: '#FF385C',
          }
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
        <span>$20</span>
        <span>$500</span>
      </div>
    </div>

    {/* Capacidad */}
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontWeight: '600', fontSize: '16px', marginBottom: '20px' }}>
    Capacidad
  </p>
  <TextField
    label="Capacidad mínima"
    type="number"
    value={capacidad === 0 ? '' : capacidad}
    onChange={(e) => {
      const val = parseInt(e.target.value);
      setCapacidad(isNaN(val) ? 0 : val);
    }}
    placeholder="Ej: 2, 5, 10..."
    fullWidth
    size="small"
    inputProps={{ min: 0 }}
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
      }
    }}
  />
</div>

    {/* Botones */}
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button
        onClick={limpiarFiltros}
        fullWidth
        variant="outlined"
        sx={{
          borderRadius: '8px',
          borderColor: '#e0e0e0',
          color: '#333',
          fontWeight: '600',
          '&:hover': { borderColor: '#333' }
        }}
      >
        Limpiar
      </Button>
      <Button
        onClick={aplicarFiltros}
        fullWidth
        variant="contained"
        sx={{
          borderRadius: '8px',
          backgroundColor: '#FF385C',
          fontWeight: '600',
          '&:hover': { backgroundColor: '#e0325a' }
        }}
      >
        Aplicar
      </Button>
    </div>
  </div>
)}
    </div>
  );
}

export default Categorybar;