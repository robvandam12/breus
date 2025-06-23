
import React from 'react';

interface BreusLogoProps {
  size?: number;
  className?: string;
}

export const BreusLogo = ({ size = 64, className = "" }: BreusLogoProps) => {
  return (
    <img 
      src="/breus-logo.png" 
      alt="Breus Logo" 
      width={size} 
      height={size}
      className={`object-contain ${className}`}
    />
  );
};
