import { useState, useEffect } from "react";
import maleta from "../../assets/maleta.png";
import camara from "../../assets/camara.png";

function HeroIcon() {
  const [icono, setIcono] = useState(maleta);

  useEffect(() => {
    const opciones = [maleta, camara];
    let i = 0;

    const interval = setInterval(() => {
      setIcono(opciones[i % opciones.length]);
      i++;
    }, 11000); // cambia cada 15 segundos

    return () => clearInterval(interval);
  }, []);

  <img src={icono} alt="hero" className="fade" style={{ maxWidth: "70%" }} />

  return (
   <div style={{
  background: "radial-gradient(circle, #FF9AA2 0%, #FF385C 100%)",
  borderRadius: "50%",
  width: "220px",
  height: "220px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}}>
  <img src={icono} alt="hero" style={{ maxWidth: "70%" }} />
</div>

  );
}

export default HeroIcon;
