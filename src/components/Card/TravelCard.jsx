import Card from './Card';
import CardImage from './CardImage';
import CardHeader from './CardHeader';
import CardTitle from './CardTitle';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import { useNavigate } from 'react-router-dom';

const TravelCard = ({ card }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/alojamiento/${card.id_alojamiento}`)}
      style={{ cursor: 'pointer' }}
      className="h-full"
    >
      <Card
        variant="default"
        padding="none"
        className="rounded-xl overflow-hidden h-full"
        style={{ minHeight: '420px', display: 'flex', flexDirection: 'column' }}
      >
        <CardImage
          src={`http://localhost:3000/api/alojamientos/${card.id_alojamiento}/imagenes/${card.id_imagen_principal}`}
          alt={card.titulo}
        />
        <CardHeader>
          <CardTitle>{card.titulo}</CardTitle>
          <p style={{ color: "#f59e0b", fontSize: "16px", marginTop: "4px" }}>
            ★ {card.calificacion_promedio > 0 ? card.calificacion_promedio.toFixed(1) : 'Nuevo'}
          </p>
        </CardHeader>

        {/* flex-1 hace que este bloque crezca y empuje el footer siempre al fondo */}
        <CardBody className="flex-1">
          <p style={{ color: "#6b7280", fontSize: "14px" }}>{card.ciudad}, {card.pais}</p>
          <p
            style={{ color: "#6b7280", fontSize: "14px" }}
            className="line-clamp-2"
          >
            {card.descripcion}
          </p>
        </CardBody>

        <CardFooter>
          <p style={{ fontSize: "22px", fontWeight: "700" }}>
            ${card.precio_por_noche} <span style={{ fontSize: "14px", fontWeight: "400", color: "#6b7280" }}>/ noche</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TravelCard;