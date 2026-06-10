import React from 'react';

const PromoTag = ({ discount, className = '' }) => {
  // If discount is a percentage, show as "20% OFF"
  // If it's an amount, show as "$2 OFF"
  // For simplicity, we'll assume discount is a percentage string or number
  const displayText = typeof discount === 'string' ? discount : `${discount}% OFF`;

  return (
    <div className={`absolute -top-2 -right-2 z-20 ${className}`}>
      <div className="flex items-center justify-center bg-markeat-saffron text-markeat-terracotta px-3 py-1 rounded-xl text-xs font-bold
                     shadow-md shadow-markeat-saffron/20 transform rotate-6
                     border border-markeat-terracotta/20">
        {displayText}
      </div>
    </div>
  );
};

export default PromoTag;
