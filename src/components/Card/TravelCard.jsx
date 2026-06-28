import Card from './Card';
import CardImage from './CardImage';
import CardHeader from './CardHeader';
import CardTitle from './CardTitle';
import CardBody from './CardBody';
import CardFooter from './CardFooter';

const TravelCard = ({ card }) => {
  return (
    <Card variant={card.id % 2 === 0 ? "primary" : "default"} padding="none" className="rounded-xl overflow-hidden" style={{ minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
      {card.imagen && <CardImage src={card.imagen} alt={card.titulo} />}
      <CardHeader>
        <CardTitle>{card.titulo}</CardTitle>
        <p style={{ color: "#f59e0b", fontSize: "16px", marginTop: "4px" }}>
          ★ {card.rating}
        </p>
      </CardHeader>
      <CardBody>
        <p style={{ color: "#2f3033", fontSize: "14px" }}>
          {card.descripcion}
        </p>
      </CardBody>
      <CardFooter>
        <p style={{ fontSize: "15px", fontWeight: "700" }}>
          ${card.precio}<span style={{ fontSize: "15px", fontWeight: "700", color: "#000000" }}> por 2 noches</span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default TravelCard;