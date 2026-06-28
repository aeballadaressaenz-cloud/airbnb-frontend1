

const CardBody= ({ children, className = "" }) => {
  return <div className={`text-gray-600 ${className}`}>
    {children}
  </div>;
};

export default CardBody