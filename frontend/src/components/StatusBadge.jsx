const StatusBadge = ({ status }) => {
  const statusConfig = {
    Applied: "bg-gray-100 text-gray-800 border border-gray-300",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold tracking-wide ${
        statusConfig[status] || "bg-gray-100 text-gray-800 border border-gray-300"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
