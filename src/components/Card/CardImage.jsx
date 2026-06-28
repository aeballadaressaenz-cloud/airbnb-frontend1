const CardImage = ({ src, alt = "Card Image" }) => {
  const imagenValida = src && !src.includes('null');
  const imagenFallback = `https://picsum.photos/400/200?random=${alt.length}`;

  return (
    <div style={{ width: "100%", overflow: "hidden", borderRadius: "8px 8px 0 0" }}>
      <img
        src={imagenValida ? src : imagenFallback}
        alt={alt}
        className="card-image"
        onError={(e) => {
          e.target.src = imagenFallback;
        }}
      />
    </div>
  );
};

export default CardImage;