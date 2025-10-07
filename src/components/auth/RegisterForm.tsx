'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export default function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            name: formData.name,
          },
        },
      });

      if (isSignUpComplete) {
        setSuccess('¡Registro completado! Ya puedes iniciar sesión.');
        setTimeout(() => onToggleMode(), 2000);
      } else if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setShowVerification(true);
        setSuccess('Te hemos enviado un código de verificación a tu email.');
      }
    } catch (err: any) {
      console.error('Error signing up:', err);
      
      switch (err.name) {
        case 'UsernameExistsException':
          setError('Ya existe una cuenta con este email');
          break;
        case 'InvalidPasswordException':
          setError('La contraseña no cumple con los requisitos de seguridad');
          break;
        case 'InvalidParameterException':
          setError('Parámetros inválidos. Verifica los datos ingresados.');
          break;
        default:
          setError('Error al crear la cuenta. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: formData.email,
        confirmationCode: verificationCode,
      });

      if (isSignUpComplete) {
        setSuccess('¡Email verificado! Iniciando sesión automáticamente...');
        
        // Auto-login después del registro exitoso
        const user = {
          id: formData.email,
          email: formData.email,
          name: formData.name || formData.email.split('@')[0],
          emailVerified: true,
        };
        
        login(user);
        
        // Redirigir al dashboard
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error confirming sign up:', err);
      
      switch (err.name) {
        case 'CodeMismatchException':
          setError('Código de verificación incorrecto');
          break;
        case 'ExpiredCodeException':
          setError('El código ha expirado. Solicita uno nuevo.');
          break;
        default:
          setError('Error al verificar el código. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">📧</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verificar Email
          </h1>
          <p className="text-gray-600 text-sm">
            Ingresa el código que enviamos a {formData.email}
          </p>
        </div>

        <form onSubmit={handleVerification} className="space-y-4">
          <Input
            label="Código de Verificación"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="123456"
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Verificando...' : 'Verificar Email'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowVerification(false)}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            ← Volver al registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">👤</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Crear Cuenta
        </h1>
        <p className="text-gray-600 text-sm">
          Regístrate para comenzar a usar Budget Tracker
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre Completo"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Tu nombre completo"
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="tu@empresa.com"
          required
        />

        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          helperText="Mínimo 8 caracteres, incluye mayúsculas, minúsculas, números y símbolos"
          required
        />

        <Input
          label="Confirmar Contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}