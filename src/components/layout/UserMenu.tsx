'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/hooks/useProfile';

interface UserMenuProps {
  isMobile?: boolean;
}

export function UserMenu({ isMobile = false }: UserMenuProps) {
  const { user, logout } = useAuthStore();
  const { userProfile, companyProfile } = useProfile();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push('/profile');
  };

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) return null;

  const displayName = userProfile 
    ? `${userProfile.firstName} ${userProfile.lastName}`.trim() || user.name
    : user.name;

  const initials = displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
          isOpen ? 'bg-gray-100' : ''
        }`}
      >
        {/* Profile Image or Avatar */}
        <div className={`relative ${isMobile ? 'w-8 h-8' : 'w-9 h-9'}`}>
          {userProfile?.profileImage ? (
            <img
              src={userProfile.profileImage}
              alt="Foto de perfil"
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-gray-200`}>
              <span className={`text-white font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {initials}
              </span>
            </div>
          )}
          
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* User info (desktop only) */}
        {!isMobile && (
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {displayName}
            </span>
            {userProfile?.position && (
              <span className="text-xs text-gray-500 truncate max-w-[120px]">
                {userProfile.position}
              </span>
            )}
          </div>
        )}

        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 z-40"
              onClick={() => setIsOpen(false)}
            />
          )}
          
          <div className={`absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 ${
            isMobile ? 'w-72 max-w-[90vw]' : 'w-64'
          }`}>
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10">
                {userProfile?.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt="Foto de perfil"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {companyProfile?.companyName || user.email}
                </p>
                {userProfile?.position && (
                  <p className="text-xs text-blue-600 truncate">
                    {userProfile.position}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleProfileClick}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Editar Perfil
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/categories');
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuración
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>

          {/* Company Info (if available) */}
          {companyProfile?.companyName && (
            <>
              <div className="border-t border-gray-100 my-1"></div>
              <div className="px-4 py-2">
                <p className="text-xs text-gray-500 mb-1">Empresa</p>
                <div className="flex items-center space-x-2">
                  {companyProfile.logo ? (
                    <img
                      src={companyProfile.logo}
                      alt="Logo empresa"
                      className="w-6 h-6 rounded object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">
                        {companyProfile.companyName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 truncate">
                    {companyProfile.companyName}
                  </span>
                </div>
              </div>
            </>
          )}
          </div>
        </>
      )}
    </div>
  );
}