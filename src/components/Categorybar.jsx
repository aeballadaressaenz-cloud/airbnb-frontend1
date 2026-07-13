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
    { icono: <FaUmbrellaBeach size={32} color="#c5c224" />, nombre: "Frente al Mar", tipo: "frente_al_mar" },
    { icono: <GiMountains size={32} color="#388038" />, nombre: "Resorts", tipo: "resorts" },
    { icono: <PiBuildingApartmentFill size={32} color="#72c497fb" />, nombre: "Apartamentos", tipo: "apartamento" },
    { icono: <GiHouse size={32} color="#da9c3f" />, nombre: "Propiedades", tipo: "propiedades" },
    { icono: <GiMountainClimbing size={32} color="#a8c72f" />, nombre: "Experiencias", tipo: "experiencias" },
    { icono: <GiMeditation size={32} color="#d87625" />, nombre: "Retiros", tipo: "retiros" },
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
    <div className="relative border-b border-gray-200">
      <div className="flex items-center gap-2 px-3 md:px-6 py-3 md:py-4 max-w-7xl mx-auto">

        {/* Categorías: scroll horizontal en móvil, sin el centrado absoluto que cortaba el contenido */}
        <div
        className="flex-1 min-w-0 flex items-center justify-start md:justify-center gap-6 md:gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categorias.map((cat) => (
            <div
              key={cat.nombre}
              onClick={() => onFiltroTipo(filtroActivo === cat.tipo ? "" : cat.tipo)}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0 pb-1 text-[13px] transition-all"
              style={{
                color: filtroActivo === cat.tipo ? '#FF385C' : '#555',
                borderBottom: filtroActivo === cat.tipo ? '2px solid #FF385C' : '2px solid transparent',
              }}
            >
              <span className="text-2xl">{cat.icono}</span>
              <span className="whitespace-nowrap">{cat.nombre}</span>
            </div>
          ))}
        </div>

        {/* Botón Filtros: siempre visible, no se encoge ni se lo lleva el scroll */}
        <div className="ml-2 shrink-0">
          <button
            onClick={() => setMostrarPanel(!mostrarPanel)}
            className="flex items-center gap-2 border border-gray-200 rounded-xl cursor-pointer font-semibold text-sm shrink-0 px-3 py-2.5 md:px-5 md:py-3"
            style={{
              backgroundColor: mostrarPanel ? '#f7f7f7' : 'white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
            }}
          >
            ⚙️ <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

      </div>

      {mostrarPanel && (
        <div
          className="absolute right-3 md:right-6 top-[72px] md:top-20 bg-white border border-gray-200 rounded-2xl p-6 z-[100]"
          style={{
            width: 'min(320px, calc(100vw - 24px))',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
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
