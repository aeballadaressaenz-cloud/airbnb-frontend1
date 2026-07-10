import { useState, useEffect } from "react";
import axios from "axios";
import TravelCard from './components/Card/TravelCard';
import Navbar from './components/Navbar';
import Categorybar from './components/Categorybar';
import Footerbar from './components/Footerbar';
import { Routes, Route } from 'react-router-dom';
import DetalleAlojamiento from './components/Detalle/DetalleAlojamiento';
import Login from './components/Auth/Login';
import Registro from './components/Auth/Registro';
import Perfil from './components/Auth/Perfil';
import EditarPerfil from './components/Auth/EditarPerfil';
import Valoracion from './components/Auth/Valoracion';
import HistorialReservas from './components/pages/HistorialReservas';
import Reserva from './components/pages/Reserva';
import PrivateRoute from './components/Privateroute';


const BASE_URL = 'http://localhost:3000';

function App() {
  const [alojamientos, setAlojamientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtros, setFiltros] = useState({ ciudad: "", precioMax: 500, capacidad: 0 });
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    axios.get(`${BASE_URL}/api/alojamientos`)
      .then((response) => {
        setAlojamientos(response.data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al obtener alojamientos:', error);
        setError('Error al cargar los alojamientos');
        setCargando(false);
      });
  }, []);

  const normalize = (str) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const alojamientosFiltrados = alojamientos.filter((aloj) => {
    let porTipo = true;
    if (filtroTipo === "frente_al_mar") {
      porTipo = aloj.titulo.toLowerCase().includes("playa") ||
                aloj.titulo.toLowerCase().includes("bungalow") ||
                aloj.descripcion.toLowerCase().includes("playa");
    } else if (filtroTipo === "resorts") {
      porTipo = false;
    } else if (filtroTipo === "apartamento") {
      porTipo = aloj.tipo_alojamiento === "apartamento";
    } else if (filtroTipo === "propiedades") {
      porTipo = aloj.titulo.toLowerCase().includes("colonial");
    } else if (filtroTipo === "retiros") {
      porTipo = aloj.titulo.toLowerCase().includes("cabaña");
    } else if (filtroTipo === "experiencias") {
      porTipo = aloj.titulo.toLowerCase().includes("hostal");
    }
    const porCiudad = filtros.ciudad ?
      normalize(aloj.ciudad).includes(normalize(filtros.ciudad)) ||
      normalize(aloj.pais).includes(normalize(filtros.ciudad))
      : true;
    const porPrecio = aloj.precio_por_noche <= filtros.precioMax;
    const porCapacidad = filtros.capacidad ? aloj.capacidad_personas >= filtros.capacidad : true;
    const porBusqueda = busqueda ?
      normalize(aloj.titulo).includes(normalize(busqueda)) ||
      normalize(aloj.ciudad).includes(normalize(busqueda)) ||
      normalize(aloj.pais).includes(normalize(busqueda))
      : true;
    return porTipo && porCiudad && porPrecio && porCapacidad && porBusqueda;
  });

  if (cargando) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Cargando alojamientos...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;

  return (
  
  <div className="min-h-screen bg-white">
    <Navbar onBusqueda={setBusqueda} />
    <Routes>
      <Route path="/" element={
        <>
          <Categorybar filtroActivo={filtroTipo} onFiltroTipo={setFiltroTipo} filtros={filtros} onFiltros={setFiltros} />
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {alojamientosFiltrados.length > 0 ? (
                alojamientosFiltrados.map((aloj) => (
                  <TravelCard key={aloj.id_alojamiento} card={aloj} />
                ))
              ) : (
                <p style={{ color: "#6b7280", gridColumn: "span 4" }}>
                  No se encontraron alojamientos con esos filtros.
                </p>
              )}
            </div>
          </div>
        </>
      } />
      <Route path="/alojamiento/:id" element={<DetalleAlojamiento />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/editar-perfil" element={<EditarPerfil />} />
      <Route path="/valoracion/:id" element={<Valoracion />} />
      <Route path="/reserva/:id" element={
  <PrivateRoute>
    <Reserva />
  </PrivateRoute>
} />
<Route path="/mis-reservas" element={
  <PrivateRoute>
    <HistorialReservas />
  </PrivateRoute>
} />
    </Routes>
    <Footerbar />
  </div>
);

}

export default App;