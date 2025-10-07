'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface DemoAuthProps {
  onToggleMode: () => void;
}

export default function DemoAuth({ onToggleMode }: DemoAuthProps) {
  const [email, setEmail] = useState('demo@empresa.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo user login
    const demoUser = {
      id: 'demo-user-123',
      email: email,
      name: 'Usuario Demo',
      emailVerified: true,
    };

    login(demoUser);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">🚀</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Modo Demo
        </h1>
        <p className="text-gray-600 text-sm">
          Prueba la aplicación sin configurar AWS Cognito
        </p>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-orange-900 mb-2">⚠️ Modo Desarrollo</h3>
        <p className="text-sm text-orange-800">
          Esta es una versión demo para desarrollo. Los datos no se guardan permanentemente.
        </p>
      </div>

      <form onSubmit={handleDemoLogin} className="space-y-4">
        <Input
          label="Email Demo"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="demo@empresa.com"
          required
        />

        <Input
          label="Contraseña Demo"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="demo123"
          required
        />

        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Iniciando sesión...' : 'Entrar en Modo Demo'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          ¿Quieres usar AWS Cognito?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Ir a Login Real
          </button>
        </p>
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Funcionalidades Demo</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Autenticación simulada</li>
          <li>✅ Gestión de sesiones</li>
          <li>✅ Navegación protegida</li>
          <li>✅ Datos de ejemplo</li>
        </ul>
      </div>
    </div>
  );
}