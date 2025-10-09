'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ImageUpload } from '@/components/profile/ImageUpload';
import { useToast } from '@/hooks/useToast';
import { CompanyProfile, CompanyProfileFormData } from '@/types';

interface CompanyInfoFormProps {
  profile?: CompanyProfile;
  onSave: (data: CompanyProfileFormData) => Promise<void>;
  onImageUpload: (file: File) => Promise<string>;
  isLoading: boolean;
  isSaving: boolean;
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

export function CompanyInfoForm({
  profile,
  onSave,
  onImageUpload,
  isLoading,
  isSaving
}: CompanyInfoFormProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<CompanyProfileFormData>({
    companyName: '',
    taxId: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    industry: '',
    foundedYear: '',
    logo: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        companyName: profile.companyName || '',
        taxId: profile.taxId || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        phone: profile.phone || '',
        email: profile.email || '',
        website: profile.website || '',
        description: profile.description || '',
        industry: profile.industry || '',
        foundedYear: profile.foundedYear?.toString() || '',
        logo: profile.logo || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof CompanyProfileFormData, value: string) => {
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
        logo: imageUrl
      }));
      addToast('Logo de empresa actualizado correctamente', 'success');
      return imageUrl;
    } catch (error) {
      addToast('Error al subir el logo', 'error');
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      addToast('El nombre de la empresa es obligatorio', 'error');
      return;
    }

    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      addToast('El formato del email no es válido', 'error');
      return;
    }

    // Validate website format if provided
    if (formData.website && !formData.website.startsWith('http')) {
      setFormData(prev => ({
        ...prev,
        website: `https://${prev.website}`
      }));
    }

    try {
      await onSave(formData);
      addToast('✅ Información empresarial actualizada correctamente', 'success', 5000);
    } catch (error) {
      addToast('❌ Error al guardar la información empresarial', 'error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Información Empresarial
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Actualiza la información de tu empresa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Company Logo */}
        <div className="flex flex-col items-center space-y-4">
          <ImageUpload
            currentImage={formData.logo}
            onImageUpload={handleImageUpload}
            type="logo"
            size="lg"
          />
          <p className="text-sm text-gray-500 text-center">
            Sube el logo de tu empresa (JPG, PNG, máx. 5MB)
          </p>
        </div>

        {/* Company Name and Tax ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Empresa *
            </label>
            <Input
              type="text"
              value={formData.companyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('companyName', e.target.value)}
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
              value={formData.taxId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('taxId', e.target.value)}
              placeholder="20123456789"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <Input
            type="text"
            value={formData.address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
            placeholder="Av. Principal 123, Oficina 456"
          />
        </div>

        {/* City and Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <Input
              type="text"
              value={formData.city}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('city', e.target.value)}
              placeholder="Lima, Bogotá, Ciudad de México..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País
            </label>
            <select
              value={formData.country}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              value={formData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Empresarial
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
              placeholder="contacto@miempresa.com"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sitio Web
          </label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('website', e.target.value)}
            placeholder="www.miempresa.com"
          />
        </div>

        {/* Industry and Founded Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industria
            </label>
            <select
              value={formData.industry}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('industry', e.target.value)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año de Fundación
            </label>
            <Input
              type="number"
              value={formData.foundedYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('foundedYear', e.target.value)}
              placeholder="2020"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción de la Empresa
          </label>
          <textarea
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
            placeholder="Describe tu empresa, sus servicios y valores..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            maxLength={1000}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.description.length}/1000 caracteres
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