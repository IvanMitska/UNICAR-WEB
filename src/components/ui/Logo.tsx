import React from 'react';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  variant = 'dark'
}) => {
  const sizes = {
    sm: 'text-lg tracking-[0.2em]',
    md: 'text-xl tracking-[0.25em]',
    lg: 'text-2xl tracking-[0.3em]',
    xl: 'text-3xl tracking-[0.35em]',
  };

  const colors = {
    dark: 'text-primary-900',
    light: 'text-white',
  };

  return (
    <div className={cn('font-medium', sizes[size], colors[variant], className)}>
      UNICAR
    </div>
  );
};
