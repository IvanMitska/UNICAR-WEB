import React from 'react';
import logoImg from '../../assets/logo.png';

interface ShibaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ShibaLogo: React.FC<ShibaLogoProps> = ({
  className = '',
  size = 'md'
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <img
      src={logoImg}
      alt="Shiba Cars Logo"
      className={`${sizes[size]} ${className} object-contain rounded-full`}
    />
  );
};