const FullPageLoadingSpinner = () => {
    return (
      <div className='fixed inset-0 flex justify-center items-center bg-opacity-50 z-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  };
  
  export default FullPageLoadingSpinner;