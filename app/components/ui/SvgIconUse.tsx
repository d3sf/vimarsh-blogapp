const SvgIconUse = () => {
  return (
    <div className="flex items-center justify-center bg-white dark:bg-gray-800 text-customPink border border-customPink rounded-full w-9 h-9 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-pink-50 dark:hover:bg-gray-700 hover:scale-105">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

export default SvgIconUse;