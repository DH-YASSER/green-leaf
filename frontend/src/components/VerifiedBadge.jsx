import React from 'react';

const VerifiedBadge = ({ isVerified, size = 'md' }) => {
  if (!isVerified) return null;

  // Size mapping: sm: 0.75, md: 1, lg: 1.25
  const sizeMap = { sm: 0.75, md: 1, lg: 1.25 };
  const badgeSize = sizeMap[size] || 1;

  return (
    <div className={`flex items-center space-x-2 text-xs font-medium bg-markeat-terracotta/10 rounded-xl px-3 py-1.5`}>
      {isVerified && (
        <svg
          className={`h-4 w-4 text-markeat-terracotta`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )}
      <span className="text-markeat-terracotta font-medium">Verified Supplier</span>
    </div>
  );
};

export default VerifiedBadge;