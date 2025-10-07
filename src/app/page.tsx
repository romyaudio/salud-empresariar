import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AppLayout from '@/components/layout/AppLayout'

export default function Home() {
  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">💰</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Budget Tracker
          </h1>
          <p className="text-gray-600 text-sm">
            Gestiona el presupuesto de tu pequeña empresa
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-900">Proyecto Inicializado</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            La estructura base del proyecto Next.js 14 con Tailwind CSS ha sido configurada correctamente.
          </p>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>✅ Next.js 14 + TypeScript</span>
            </div>
            <div className="flex justify-between">
              <span>✅ Tailwind CSS Mobile-First</span>
            </div>
            <div className="flex justify-between">
              <span>✅ Componentes UI Base</span>
            </div>
            <div className="flex justify-between">
              <span>⏳ AWS Amplify Auth (Próximo)</span>
            </div>
          </div>
        </div>

        {/* Demo Components */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Componentes Demo</h3>
          
          <div className="space-y-4">
            <Input 
              label="Email" 
              type="email" 
              placeholder="tu@empresa.com"
              helperText="Ingresa tu email empresarial"
            />
            
            <Input 
              label="Monto" 
              type="number" 
              placeholder="0.00"
              helperText="Ejemplo de campo numérico"
            />
            
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1">
                Botón Primario
              </Button>
              <Button variant="secondary" className="flex-1">
                Secundario
              </Button>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Próximos Pasos</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Configurar AWS Amplify Authentication</li>
            <li>• Implementar gestión de sesiones</li>
            <li>• Crear modelos de datos</li>
            <li>• Desarrollar funcionalidades principales</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}