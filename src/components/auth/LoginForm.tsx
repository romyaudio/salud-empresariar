'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getCurrentUser } from 'aws-amplify/auth';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';

interface LoginFormProps {
  onToggleMode: () => void;
}

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use AWS Cognito
      console.log('🔐 Attempting AWS Cognito sign in...');
      
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password,
      });

      console.log('🔐 Sign in result:', { isSignedIn, nextStep });

      if (isSignedIn) {
        // Get the actual user from Amplify to ensure consistent ID
        const currentUser = await getCurrentUser();
        
        const user = {
          id: currentUser.userId, // Use the real Amplify user ID
          email: email,
          name: currentUser.username || email.split('@')[0],
          emailVerified: true,
          onboardingCompleted: localStorage.getItem(`onboarding_${currentUser.userId}`) === 'completed'
        };
        
        login(user);
        
        // Check if user needs onboarding
        if (!user.onboardingCompleted) {
          router.push('/onboarding');
        } else {
          router.push('/');
        }
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        // Handle new password required
        setError('Se requiere una nueva contraseña. Esta funcionalidad se implementará próximamente.');
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        setError('Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
      } else {
        setError('Error en el proceso de autenticación. Paso: ' + nextStep.signInStep);
      }
    } catch (err: any) {
      console.error('🚨 Error signing in:', err);
      console.error('🚨 Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      
      switch (err.name) {
        case 'NotAuthorizedException':
          setError('Email o contraseña incorrectos');
          break;
        case 'UserNotConfirmedException':
          setError('Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
          break;
        case 'UserNotFoundException':
          setError('Usuario no encontrado. ¿Necesitas registrarte?');
          break;
        case 'InvalidParameterException':
          setError('Parámetros inválidos. Verifica el formato del email.');
          break;
        case 'TooManyRequestsException':
          setError('Demasiados intentos. Espera un momento antes de intentar de nuevo.');
          break;
        case 'NetworkError':
          setError('Error de conexión. Verifica tu conexión a internet.');
          break;
        default:
          setError(`Error al iniciar sesión: ${err.message || 'Error desconocido'}. Revisa la consola para más detalles.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <img 
            src="/logo.svg" 
            alt="Salud Empresarial Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-gray-600 text-sm">
          Accede a tu cuenta de Salud Empresarial
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@empresa.com"
          required
          error={error && !email ? 'Email es requerido' : ''}
        />

        <PasswordInput
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          error={error && !password ? 'Contraseña es requerida' : ''}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Regístrate aquí
          </button>
        </p>
      </div>


    </div>
  );
}