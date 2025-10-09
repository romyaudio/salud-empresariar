'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (file: File) => Promise<string>;
  type: 'profile' | 'logo';
  size?: 'sm' | 'md' | 'lg';
}

export function ImageUpload({
  currentImage,
  onImageUpload,
  type,
  size = 'md'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es muy grande. Máximo 5MB permitido');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const imageUrl = await onImageUpload(file);
      // Update preview with the returned URL if different from current preview
      if (imageUrl && imageUrl !== previewUrl) {
        setPreviewUrl(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setPreviewUrl(null);
      
      // Mostrar error al usuario
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al subir imagen: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = previewUrl || currentImage;
  const isProfile = type === 'profile';

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Image Preview */}
      <div
        className={`${sizeClasses[size]} ${
          isProfile ? 'rounded-full' : 'rounded-lg'
        } border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative`}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={isProfile ? 'Foto de perfil' : 'Logo de empresa'}
            className={`w-full h-full object-cover ${
              isProfile ? 'rounded-full' : 'rounded-lg'
            }`}
          />
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-8 w-8 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-xs text-gray-500 mt-1">
              {isProfile ? 'Foto' : 'Logo'}
            </p>
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="text-sm"
      >
        {isUploading
          ? 'Subiendo...'
          : displayImage
          ? 'Cambiar imagen'
          : 'Subir imagen'
        }
      </Button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File Info */}
      <p className="text-xs text-gray-500 text-center max-w-[200px]">
        JPG, PNG hasta 5MB
        {isProfile && <br />}
        {isProfile ? 'Recomendado: 400x400px' : 'Recomendado: 200x200px'}
      </p>
    </div>
  );
}