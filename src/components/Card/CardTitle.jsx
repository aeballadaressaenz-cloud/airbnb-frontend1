
const CardTitle = ({ children, className = "" }) => {
  return <h3 className={`text-2x1 font-bold mb-2 ${className}`}>
    {children}
  </h3>;
};


export default CardTitle