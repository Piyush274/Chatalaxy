const FullPageLoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 opacity-80"></div>
      <div className="absolute animate-ping rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 opacity-30"></div>
    </div>
  );
};

export default FullPageLoadingSpinner;