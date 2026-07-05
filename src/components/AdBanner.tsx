import React from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, format = 'horizontal', className = '' }) => {
  // In a real app, this would be a Google AdSense or other ad network component
  // For now, it's a placeholder
  
  const dimensions = {
    horizontal: 'w-full h-24', // Leaderboard
    rectangle: 'w-[300px] h-[250px]', // Medium Rectangle
    vertical: 'w-[160px] h-[600px]', // Skyscraper
  };

  return (
    <div className={`bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs uppercase tracking-wider my-4 mx-auto ${dimensions[format]} ${className}`}>
      <span>Advertisement</span>
      <span className="text-[10px] mt-1">Slot: {slot}</span>
    </div>
  );
};
