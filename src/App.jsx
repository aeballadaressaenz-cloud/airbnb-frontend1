import { useState } from "react";
import { cardData } from './components/Data/cardData';
import TravelCard from './components/Card/TravelCard';
import Navbar from './components/Navbar';
import Categorybar from './components/Categorybar';
import Footerbar from './components/Footerbar';

function App() {
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtros, setFiltros] = useState({ ciudad: "", precioMax: 500, capacidad: 0 });

   const [busqueda, setBusqueda] = useState("");
  const cardsFiltradas = cardData.filter((card) => {
  const porTipo = filtroTipo ? card.tipo === filtroTipo : true;
  const porCiudad = filtros.ciudad ? card.ciudad.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtros.ciudad.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) : true;
  const porPrecio = card.precio <= filtros.precioMax;
  const porCapacidad = filtros.capacidad ? card.capacidad >= filtros.capacidad : true;
  const porBusqueda = busqueda
    ? card.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(busqueda.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    : true;
  return porTipo && porCiudad && porPrecio && porCapacidad && porBusqueda;
});
<Navbar onBusqueda={setBusqueda} />

  return (
    <div className="min-h-screen bg-white">
      <Navbar onBusqueda={setBusqueda} />
      
      <Categorybar filtroActivo={filtroTipo} onFiltroTipo={setFiltroTipo} filtros={filtros} onFiltros={setFiltros} />
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {cardsFiltradas.length > 0 ? (
            cardsFiltradas.map((card) => (
              <TravelCard key={card.id} card={card} />
            ))
          ) : (
            <p style={{ color: "#6b7280", gridColumn: "span 4" }}>
              No se encontraron alojamientos con esos filtros.
            </p>
          )}
        </div>
      </div>
      <Footerbar />
    </div>
  );
}

export default App;