'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ImageUpload } from '@/components/profile/ImageUpload';
import { useToast } from '@/hooks/useToast';
import { UserProfile, UserProfileFormData } from '@/types';

interface PersonalInfoFormProps {
  profile?: UserProfile;
  onSave: (data: UserProfileFormData) => Promise<void>;
  onImageUpload: (file: File) => Promise<string>;
  isLoading: boolean;
  isSaving: boolean;
}

export function PersonalInfoForm({
  profile,
  onSave,
  onImageUpload,
  isLoading,
  isSaving
}: PersonalInfoFormProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<UserProfileFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    position: '',
    bio: '',
    profileImage: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        position: profile.position || '',
        bio: profile.bio || '',
        profileImage: profile.profileImage || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof UserProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await onImageUpload(file);
      setFormData(prev => ({
        ...prev,
        profileImage: imageUrl
      }));
      addToast('Foto de perfil actualizada correctamente', 'success');
      return imageUrl;
    } catch (error) {
      addToast('Error al subir la imagen', 'error');
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      addToast('El nombre y apellido son obligatorios', 'error');
      return;
    }

    try {
      await onSave(formData);
      addToast('✅ Información personal actualizada correctamente', 'success', 5000);
    } catch (error) {
      addToast('❌ Error al guardar la información', 'error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Información Personal
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Actualiza tu información personal y foto de perfil
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center space-y-4">
          <ImageUpload
            currentImage={formData.profileImage}
            onImageUpload={handleImageUpload}
            type="profile"
            size="lg"
          />
          <p className="text-sm text-gray-500 text-center">
            Sube una foto de perfil profesional (JPG, PNG, máx. 5MB)
          </p>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido *
            </label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
              placeholder="Tu apellido"
              required
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo/Posición
            </label>
            <Input
              type="text"
              value={formData.position}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('position', e.target.value)}
              placeholder="CEO, Gerente, etc."
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biografía
          </label>
          <textarea
            value={formData.bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('bio', e.target.value)}
            placeholder="Cuéntanos un poco sobre ti y tu experiencia..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            maxLength={500}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.bio.length}/500 caracteres
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSaving || isLoading}
            className="min-w-[120px]"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}