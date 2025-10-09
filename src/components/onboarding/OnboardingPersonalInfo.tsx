'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';

interface PersonalData {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  position?: string;
  bio?: string;
  profileImage?: string;
}

interface OnboardingPersonalInfoProps {
  data: PersonalData;
  onComplete: (data: PersonalData) => void;
}

const countries = [
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Ecuador',
  'El Salvador',
  'Guatemala',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'República Dominicana',
  'Uruguay',
  'Venezuela',
  'España',
  'Estados Unidos',
  'Otro'
];

export function OnboardingPersonalInfo({ data, onComplete }: OnboardingPersonalInfoProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<PersonalData>(data);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof PersonalData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!formData.firstName.trim()) {
      addToast('El nombre es obligatorio', 'error');
      setIsLoading(false);
      return;
    }

    if (!formData.lastName.trim()) {
      addToast('El apellido es obligatorio', 'error');
      setIsLoading(false);
      return;
    }

    if (!formData.address.trim()) {
      addToast('La dirección es obligatoria', 'error');
      setIsLoading(false);
      return;
    }

    if (!formData.city.trim()) {
      addToast('La ciudad es obligatoria', 'error');
      setIsLoading(false);
      return;
    }

    if (!formData.country.trim()) {
      addToast('El país es obligatorio', 'error');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete(formData);
    } catch (error) {
      addToast('Error al guardar la información', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Información Personal
        </h2>
        <p className="text-gray-600">
          Cuéntanos sobre ti. Esta información nos ayudará a personalizar tu experiencia.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
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
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Tu apellido"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="tu@empresa.com"
            disabled
            className="bg-gray-50 text-gray-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Este es el email que usaste para registrarte
          </p>
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
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo/Posición
            </label>
            <Input
              type="text"
              value={formData.position || ''}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder="CEO, Gerente, etc."
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección *
          </label>
          <Input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Av. Principal 123, Apartamento 456"
            required
          />
        </div>

        {/* City and Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad *
            </label>
            <Input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Lima, Bogotá, Ciudad de México..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País *
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecciona un país</option>
              {countries.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biografía (Opcional)
          </label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Cuéntanos un poco sobre ti y tu experiencia..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            maxLength={300}
          />
          <p className="text-sm text-gray-500 mt-1">
            {(formData.bio || '').length}/300 caracteres
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[140px]"
          >
            {isLoading ? 'Guardando...' : 'Continuar'}
          </Button>
        </div>
      </form>
    </div>
  );
}