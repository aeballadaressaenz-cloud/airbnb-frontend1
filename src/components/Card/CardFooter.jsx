

const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`px-4 pb-4 mt-4 ${className}`}>
      {children}
    </div>
  );
};

export default CardFooter;