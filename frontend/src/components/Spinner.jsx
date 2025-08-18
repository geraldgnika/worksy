const Spinner = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-indigo-600 mx-auto mb-6 shadow-md"></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
          </div>
        </div>
        <p className="mt-2 text-gray-700 text-lg font-semibold tracking-wide select-none">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Spinner;
