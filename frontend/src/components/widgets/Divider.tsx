const Divider = ({ dashed = false, className = "" }) => {
  return (
    <div
      className={`border-b ${
        dashed ? "border-dashed" : "border-solid"
      } border-gray-300 ${className}`}
    />
  );
};

export default Divider;
