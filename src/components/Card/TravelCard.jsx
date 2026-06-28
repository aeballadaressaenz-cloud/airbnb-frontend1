import Card from './Card';
import CardImage from './CardImage';
import CardHeader from './CardHeader';
import CardTitle from './CardTitle';
import CardBody from './CardBody';
import CardFooter from './CardFooter';

const TravelCard = ({ card }) => {
  return (
    <Card variant={card.id_alojamiento % 2 === 0 ? "primary" : "default"} padding="none" className="rounded-xl overflow-hidden" style={{ minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
      <CardImage src={`http://localhost:3000/api/alojamientos/${card.id_alojamiento}/imagenes/${card.id_imagen_principal}`} alt={card.titulo} />
      <CardHeader>
        <CardTitle>{card.titulo}</CardTitle>
        <p style={{ color: "#f59e0b", fontSize: "16px", marginTop: "4px" }}>
          ★ {card.calificacion_promedio > 0 ? card.calificacion_promedio.toFixed(1) : 'Nuevo'}
        </p>
      </CardHeader>
      <CardBody>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>{card.ciudad}, {card.pais}</p>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>{card.descripcion}</p>
      </CardBody>
      <CardFooter>
        <p style={{ fontSize: "22px", fontWeight: "700" }}>
          ${card.precio_por_noche} <span style={{ fontSize: "14px", fontWeight: "400", color: "#6b7280" }}>/ noche</span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default TravelCard;