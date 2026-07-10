import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoArrowBack } from "react-icons/io5";
import { IoPeopleOutline, IoBedOutline, IoWaterOutline } from "react-icons/io5";
import { MdOutlineApartment, MdCheckCircleOutline } from "react-icons/md";

const BASE_URL = 'http://localhost:3000';

const DetalleAlojamiento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alojamiento, setAlojamiento] = useState(null);
  const [amenidades, setAmenidades] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para la mini reserva (fechas y huéspedes)
  const [fechaEntrada, setFechaEntrada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [numHuespedes, setNumHuespedes] = useState(1);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/alojamientos/${id}`)
      .then((response) => {
        setAlojamiento(response.data.alojamiento);
        setAmenidades(response.data.amenidades);
        setValoraciones(response.data.valoraciones);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setCargando(false);
      });
  }, [id]);

  const handleReservar = () => {
    navigate(`/reserva/${id}`, {
      state: {
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
        num_huespedes: numHuespedes,
      },
    });
  };

  if (cargando) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;
  if (!alojamiento) return <div style={{ textAlign: 'center', padding: '50px' }}>Alojamiento no encontrado.</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>

      {/* Imagen principal con botón volver encima */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <img
          src={`${BASE_URL}/api/alojamientos/${id}/imagenes/${alojamiento.id_imagen_principal}`}
          alt={alojamiento.titulo}
          className="w-full h-56 md:h-[400px] object-cover rounded-2xl"
          onError={(e) => { e.target.src = `https://picsum.photos/900/400?random=${id}`; }}
        />
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <IoArrowBack size={18} />
        </button>
      </div>

      {/* Título y rating */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
        <h1 className="text-2xl md:text-[28px] font-bold">{alojamiento.titulo}</h1>
        <p style={{ color: '#f59e0b', fontSize: '18px' }}>
          ★ {alojamiento.calificacion_promedio > 0 ? alojamiento.calificacion_promedio.toFixed(1) : 'Nuevo'}
        </p>
      </div>

      {/* Ciudad y país */}
      <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '16px' }}>
        {alojamiento.ciudad}, {alojamiento.pais}
      </p>

      {/* Detalles */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IoPeopleOutline size={18} /> {alojamiento.capacidad_personas} personas
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IoBedOutline size={18} /> {alojamiento.num_habitaciones} habitaciones
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IoWaterOutline size={18} /> {alojamiento.num_banos} baños
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MdOutlineApartment size={18} /> {alojamiento.tipo_alojamiento}
        </span>
      </div>

      {/* Layout de dos columnas: apiladas en móvil, lado a lado desde md */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">

        {/* Columna izquierda */}
        <div className="flex-1 w-full min-w-0">

          {/* Anfitrión */}
          <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              Alojamiento completo ofrecido por {alojamiento.anfitrion}
            </h2>
          </div>

          {/* Descripción */}
          <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Sobre este espacio</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
              {alojamiento.descripcion}
            </p>
          </div>

          {/* Amenidades */}
          {amenidades.length > 0 && (
            <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Lo que ofrece este lugar</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {amenidades.map((am, index) => (
                  <span key={index} style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MdCheckCircleOutline size={18} color="#FF385C" /> {am.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Valoraciones */}
          {valoraciones.length > 0 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
                ★ {alojamiento.calificacion_promedio.toFixed(1)} · {valoraciones.length} reseñas
              </h2>
              {valoraciones.map((val, index) => (
                <div key={index} style={{
                  padding: '16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <p style={{ fontWeight: '600' }}>{val.huesped}</p>
                    <p style={{ color: '#f59e0b' }}>★ {val.calificacion}</p>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>{val.comentario}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha - Precio */}
        <div
          className="w-full md:w-[340px] md:sticky md:top-6"
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <p style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>
            ${alojamiento.precio_por_noche} <span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280' }}>/ noche</span>
          </p>

          <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
              <div style={{ flex: 1, padding: '8px 12px', borderRight: '1px solid #e0e0e0', minWidth: 0, boxSizing: 'border-box' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '2px' }}>
                  LLEGADA
                </label>
                <input
                  type="date"
                  value={fechaEntrada}
                  onChange={(e) => setFechaEntrada(e.target.value)}
                  style={{
                    fontSize: '14px',
                    color: '#111',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    padding: 0,
                    fontFamily: 'inherit',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
              <div style={{ flex: 1, padding: '8px 14px 8px 12px', minWidth: 0, boxSizing: 'border-box' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '2px' }}>
                  SALIDA
                </label>
                <input
                  type="date"
                  value={fechaSalida}
                  min={fechaEntrada || undefined}
                  onChange={(e) => setFechaSalida(e.target.value)}
                  style={{
                    fontSize: '14px',
                    color: '#111',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    maxWidth: '100%',
                    padding: 0,
                    fontFamily: 'inherit',
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            <div style={{ padding: '8px 14px 8px 12px', boxSizing: 'border-box' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '2px' }}>
                HUÉSPEDES
              </label>
              <input
                type="number"
                min="1"
                max={alojamiento.capacidad_personas || undefined}
                value={numHuespedes}
                onChange={(e) => setNumHuespedes(Number(e.target.value))}
                style={{
                  fontSize: '14px',
                  color: '#111',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  padding: 0,
                  fontFamily: 'inherit',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
          </div>

          <button
            onClick={handleReservar}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#FF385C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            Reservar
          </button>

          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            No se te cobrará aún
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetalleAlojamiento;