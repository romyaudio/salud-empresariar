'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import DemoAuth from '@/components/auth/DemoAuth';

type AuthMode = 'demo' | 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('demo');

  const toggleLoginRegister = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const switchToDemo = () => setMode('demo');
  const switchToLogin = () => setMode('login');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Mode Selector */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm border border-gray-200">
          <button
            onClick={switchToDemo}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'demo'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Demo
          </button>
          <button
            onClick={switchToLogin}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'login' || mode === 'register'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            AWS Cognito
          </button>
        </div>

        {/* Auth Forms */}
        {mode === 'demo' && (
          <DemoAuth onToggleMode={switchToLogin} />
        )}
        
        {mode === 'login' && (
          <LoginForm onToggleMode={toggleLoginRegister} />
        )}
        
        {mode === 'register' && (
          <RegisterForm onToggleMode={toggleLoginRegister} />
        )}
      </div>
    </div>
  );
}