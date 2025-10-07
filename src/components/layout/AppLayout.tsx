import { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header placeholder */}
      <header className="bg-white shadow-sm border-b border-gray-200 safe-top">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Budget Tracker</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6 pb-20">
        {children}
      </main>
      
      {/* Mobile navigation placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
        <div className="flex justify-around py-2">
          <div className="flex flex-col items-center py-2 px-3 text-gray-500">
            <div className="w-6 h-6 mb-1 bg-gray-300 rounded"></div>
            <span className="text-xs">Dashboard</span>
          </div>
          <div className="flex flex-col items-center py-2 px-3 text-gray-500">
            <div className="w-6 h-6 mb-1 bg-gray-300 rounded"></div>
            <span className="text-xs">Ingresos</span>
          </div>
          <div className="flex flex-col items-center py-2 px-3 text-gray-500">
            <div className="w-6 h-6 mb-1 bg-gray-300 rounded"></div>
            <span className="text-xs">Gastos</span>
          </div>
          <div className="flex flex-col items-center py-2 px-3 text-gray-500">
            <div className="w-6 h-6 mb-1 bg-gray-300 rounded"></div>
            <span className="text-xs">Exportar</span>
          </div>
        </div>
      </nav>
    </div>
  )
}