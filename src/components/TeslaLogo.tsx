import React from 'react';

interface TeslaLogoProps {
  className?: string;
  size?: number | string;
  color?: string;
}

export const TeslaLogo: React.FC<TeslaLogoProps> = ({
  className = 'w-8 h-8',
  color = '#E82127',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Tesla Logo"
      role="img"
    >
      {/* Top curved arch bar */}
      <path d="M 50,11.4 C 61.8,11.4 72.8,12.5 83.2,14.5 L 85.8,8.2 C 74.8,5.3 62.9,3.8 50,3.8 C 37.1,3.8 25.2,5.3 14.2,8.2 L 16.8,14.5 C 27.2,12.5 38.2,11.4 50,11.4 Z" />
      {/* Central stylized T emblem with swooping wings, top V-notch, and tapering dagger blade */}
      <path d="M 50,29.8 L 38.2,19.5 C 29.6,20.8 22.0,23.3 15.5,26.8 L 23.4,35.0 C 27.6,31.2 34.2,27.9 41.8,26.8 L 50,95.0 L 58.2,26.8 C 65.8,27.9 72.4,31.2 76.6,35.0 L 84.5,26.8 C 78.0,23.3 70.4,20.8 61.8,19.5 L 50,29.8 Z" />
    </svg>
  );
};
