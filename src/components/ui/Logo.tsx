import React from 'react';
import { cn } from '../../utils/cn';
import { ShibaLogo } from './ShibaLogo';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <ShibaLogo size={size} />
      <div className={cn('font-display font-bold tracking-wider', textSizes[size])}>
        <span className="text-white">SHIBA</span>
        <span className="text-yellow-500">CARS</span>
      </div>
    </div>
  );
};