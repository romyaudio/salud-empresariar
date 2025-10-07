'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, confirmSignIn } from 'aws-amplify/auth';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
      // Check if we're in demo mode
      const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

      if (!isDemoMode) {
        // Use real AWS Cognito
        console.log('🔐 Attempting AWS Cognito sign in...');
        
        const { isSignedIn, nextStep } = await signIn({
          username: email,
          password: password,
        });

        console.log('🔐 Sign in result:', { isSignedIn, nextStep });

        if (isSignedIn) {
          // User is signed in successfully
          const user = {
            id: email, // Temporary, will be updated when we get user details
            email: email,
            name: email.split('@')[0], // Temporary name
            emailVerified: true,
          };
          
          login(user);
          
          // Redirigir al dashboard
          router.push('/');
        } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          // Handle new password required
          setError('Se requiere una nueva contraseña. Esta funcionalidad se implementará próximamente.');
        } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
          setError('Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
        } else {
          setError('Error en el proceso de autenticación. Paso: ' + nextStep.signInStep);
        }
      } else {
        // Demo mode - simulate authentication
        console.log('🎭 Demo mode authentication');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'demo@empresa.com' || email.includes('@')) {
          const user = {
            id: 'demo-user-123',
            email: email,
            name: email.split('@')[0] || 'Usuario Demo',
            emailVerified: true,
          };
          
          login(user);
          
          // Redirigir al dashboard
          router.push('/');
        } else {
          setError('Email o contraseña incorrectos');
        }
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
        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">🔐</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-gray-600 text-sm">
          Accede a tu cuenta de Budget Tracker
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

        <Input
          label="Contraseña"
          type="password"
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

      {/* Demo credentials */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Modo Demo</h4>
        <p className="text-sm text-blue-800 mb-2">
          Para probar la aplicación sin AWS Cognito configurado:
        </p>
        <div className="text-xs text-blue-700 space-y-1">
          <p>Email: demo@empresa.com</p>
          <p>Contraseña: cualquier texto</p>
        </div>
      </div>
    </div>
  );
}