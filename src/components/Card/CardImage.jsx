const CardImage = ({ src, alt = "Card Image"}) => {
  return (
    <div style={{ width: "100%", overflow: "hidden", borderRadius: "8px 8px 0 0" }}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="card-image"
        />
      ) : (
        <div style={{ height: "200px", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#9ca3af", fontSize: "14px" }}>No image available</span>
        </div>
      )}
    </div>
  );
};

export default CardImage;