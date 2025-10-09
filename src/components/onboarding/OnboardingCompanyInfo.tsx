'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';

interface PersonalData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  position?: string;
  bio?: string;
  profileImage?: string;
}

interface CompanyData {
  companyName: string;
  address: string;
  city: string;
  country: string;
  taxId?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  industry?: string;
  foundedYear?: string;
  logo?: string;
  usePersonalAddress?: boolean;
}

interface OnboardingCompanyInfoProps {
  data: CompanyData;
  personalData: PersonalData;
  onComplete: (data: CompanyData) => void;
  onBack: () => void;
}

const industries = [
  'Tecnología',
  'Retail/Comercio',
  'Servicios Financieros',
  'Salud',
  'Educación',
  'Manufactura',
  'Construcción',
  'Turismo y Hospitalidad',
  'Transporte y Logística',
  'Agricultura',
  'Inmobiliaria',
  'Consultoría',
  'Marketing y Publicidad',
  'Alimentación y Bebidas',
  'Otro'
];

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

export function OnboardingCompanyInfo({ 
  data, 
  personalData, 
  onComplete, 
  onBack 
}: OnboardingCompanyInfoProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<CompanyData>(data);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof CompanyData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUsePersonalAddress = (use: boolean) => {
    if (use) {
      setFormData(prev => ({
        ...prev,
        usePersonalAddress: true,
        address: personalData.address,
        city: personalData.city,
        country: personalData.country
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        usePersonalAddress: false,
        address: '',
        city: '',
        country: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!formData.companyName.trim()) {
      addToast('El nombre de la empresa es obligatorio', 'error');
      setIsLoading(false);
      return;
    }

    if (!formData.address.trim()) {
      addToast('La dirección de la empresa es obligatoria', 'error');
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

    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      addToast('El formato del email no es válido', 'error');
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
          Información de la Empresa
        </h2>
        <p className="text-gray-600">
          Ahora cuéntanos sobre tu empresa para completar tu perfil.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name and Tax ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Empresa *
            </label>
            <Input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Mi Empresa S.A."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RUC/NIT/Tax ID
            </label>
            <Input
              type="text"
              value={formData.taxId || ''}
              onChange={(e) => handleInputChange('taxId', e.target.value)}
              placeholder="20123456789"
            />
          </div>
        </div>

        {/* Use Personal Address Option */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="usePersonalAddress"
              checked={formData.usePersonalAddress || false}
              onChange={(e) => handleUsePersonalAddress(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="ml-3">
              <label htmlFor="usePersonalAddress" className="text-sm font-medium text-blue-900">
                Usar mi dirección personal como dirección de la empresa
              </label>
              <p className="text-sm text-blue-700 mt-1">
                {personalData.address}, {personalData.city}, {personalData.country}
              </p>
            </div>
          </div>
        </div>

        {/* Address Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección de la Empresa *
          </label>
          <Input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Av. Principal 123, Oficina 456"
            required
            disabled={formData.usePersonalAddress}
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
              disabled={formData.usePersonalAddress}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País *
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={formData.usePersonalAddress}
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

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono Empresarial
            </label>
            <Input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Empresarial
            </label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contacto@miempresa.com"
            />
          </div>
        </div>

        {/* Website and Industry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sitio Web
            </label>
            <Input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="www.miempresa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industria
            </label>
            <select
              value={formData.industry || ''}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona una industria</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción de la Empresa (Opcional)
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe tu empresa, sus servicios y valores..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            maxLength={500}
          />
          <p className="text-sm text-gray-500 mt-1">
            {(formData.description || '').length}/500 caracteres
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            Atrás
          </Button>
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