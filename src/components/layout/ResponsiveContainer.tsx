'use client';

import { ReactNode } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  center?: boolean;
}

const maxWidthClasses = {
  xs: 'max-w-xs',
  sm: 'max-w-sm', 
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full'
};

export function ResponsiveContainer({ 
  children, 
  className = '',
  maxWidth = 'full',
  padding = true,
  center = true
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const containerClasses = [
    'w-full',
    maxWidthClasses[maxWidth],
    center ? 'mx-auto' : '',
    padding ? (isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-8') : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}

// Grid component with responsive columns
interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = ''
}: ResponsiveGridProps) {
  const getGridCols = () => {
    const colsArray = [];
    
    if (cols.xs) colsArray.push(`grid-cols-${cols.xs}`);
    if (cols.sm) colsArray.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) colsArray.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) colsArray.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) colsArray.push(`xl:grid-cols-${cols.xl}`);
    if (cols['2xl']) colsArray.push(`2xl:grid-cols-${cols['2xl']}`);
    
    return colsArray.join(' ');
  };

  return (
    <div className={`grid ${getGridCols()} gap-${gap} ${className}`}>
      {children}
    </div>
  );
}

// Responsive Stack component
interface ResponsiveStackProps {
  children: ReactNode;
  direction?: {
    xs?: 'row' | 'col';
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
  };
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}

export function ResponsiveStack({
  children,
  direction = { xs: 'col', md: 'row' },
  gap = 4,
  align = 'start',
  justify = 'start',
  className = ''
}: ResponsiveStackProps) {
  const getDirectionClasses = () => {
    const directionArray = [];
    
    if (direction.xs) directionArray.push(`flex-${direction.xs}`);
    if (direction.sm) directionArray.push(`sm:flex-${direction.sm}`);
    if (direction.md) directionArray.push(`md:flex-${direction.md}`);
    if (direction.lg) directionArray.push(`lg:flex-${direction.lg}`);
    
    return directionArray.join(' ');
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  return (
    <div className={`
      flex ${getDirectionClasses()} gap-${gap} 
      ${alignClasses[align]} ${justifyClasses[justify]} 
      ${className}
    `}>
      {children}
    </div>
  );
}