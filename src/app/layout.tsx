import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/auth/AuthProvider'
import ConnectionStatus from '@/components/debug/ConnectionStatus'
import AuthDebug from '@/components/debug/AuthDebug'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Budget Tracker',
  description: 'Aplicación de presupuesto para pequeñas empresas',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
          {process.env.NODE_ENV === 'development' && (
            <>
              <AuthDebug />
              <ConnectionStatus showDetails={true} />
            </>
          )}
        </AuthProvider>
      </body>
    </html>
  )
}