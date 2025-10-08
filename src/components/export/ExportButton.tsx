'use client';

import { useState } from 'react';
import { TouchOptimizedButton } from '@/components/ui/TouchOptimizedButton';
import { ExportDialog } from './ExportDialog';

interface ExportButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function ExportButton({ 
  variant = 'secondary', 
  size = 'md',
  className = '',
  showLabel = true
}: ExportButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    setIsDialogOpen(true);
    
    // Trigger haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <>
      <TouchOptimizedButton
        variant={variant}
        size={size}
        icon="📤"
        onClick={handleClick}
        className={className}
      >
        {showLabel ? 'Exportar' : ''}
      </TouchOptimizedButton>

      <ExportDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}