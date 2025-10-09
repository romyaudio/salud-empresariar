'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, confirmSignUp, signIn, resendSignUpCode } from 'aws-amplify/auth';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';

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
      const { isSignUpComplete, nextStep } = await signUp({
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
        
        try {
          // Sign in the user after successful verification
          const { isSignedIn } = await signIn({
            username: formData.email,
            password: formData.password,
          });

          if (isSignedIn) {
            // Get the actual user from Amplify after successful sign in
            const { getCurrentUser } = await import('aws-amplify/auth');
            const currentUser = await getCurrentUser();
            
            const user = {
              id: currentUser.userId, // Use the real Amplify user ID
              email: formData.email,
              name: formData.name || formData.email.split('@')[0],
              emailVerified: true,
              isNewUser: true,
              onboardingCompleted: false,
            };
            
            login(user);
            
            // Redirigir al onboarding para usuarios nuevos
            setTimeout(() => {
              router.push('/onboarding');
            }, 1500);
          } else {
            setError('Error al iniciar sesión automáticamente. Por favor, inicia sesión manualmente.');
            setTimeout(() => onToggleMode(), 2000);
          }
        } catch (signInError: any) {
          console.error('Error during auto sign-in:', signInError);
          setError('Verificación exitosa. Por favor, inicia sesión manualmente.');
          setTimeout(() => onToggleMode(), 2000);
        }
      }
    } catch (err: any) {
      console.error('Error confirming sign up:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code
      });
      
      switch (err.name) {
        case 'CodeMismatchException':
          setError('Código de verificación incorrecto. Verifica que hayas ingresado el código correcto.');
          break;
        case 'ExpiredCodeException':
          setError('El código ha expirado. Solicita uno nuevo.');
          break;
        case 'NotAuthorizedException':
          setError('Código inválido o expirado. Verifica el código o solicita uno nuevo.');
          break;
        case 'UserNotFoundException':
          setError('Usuario no encontrado. Intenta registrarte de nuevo.');
          break;
        case 'InvalidParameterException':
          setError('Código inválido. Debe ser un código de 6 dígitos.');
          break;
        case 'TooManyFailedAttemptsException':
          setError('Demasiados intentos fallidos. Espera un momento antes de intentar de nuevo.');
          break;
        default:
          setError(`Error al verificar el código: ${err.message || 'Error desconocido'}. Revisa la consola para más detalles.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
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

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                await resendSignUpCode({ username: formData.email });
                setSuccess('Código reenviado a tu email.');
                setError('');
              } catch (err: any) {
                console.error('Error resending code:', err);
                setError('Error al reenviar el código. Inténtalo de nuevo.');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm block w-full"
          >
            🔄 Reenviar código
          </button>
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
        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <img 
            src="/logo.svg" 
            alt="Salud Empresarial Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Crear Cuenta
        </h1>
        <p className="text-gray-600 text-sm">
          Regístrate para comenzar a usar Salud Empresarial
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

        <PasswordInput
          label="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          helperText="Mínimo 8 caracteres, incluye mayúsculas, minúsculas, números y símbolos"
          required
        />

        <PasswordInput
          label="Confirmar Contraseña"
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