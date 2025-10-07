# Budget Tracker

Aplicación de presupuesto para pequeñas empresas construida con Next.js 14, TypeScript y AWS Amplify.

## Características

- 📱 Diseño móvil-first con Tailwind CSS
- 🔐 Autenticación segura con AWS Cognito
- 📊 Dashboard con visualización de datos
- 💰 Registro de ingresos y gastos
- 📈 Categorización y análisis de gastos
- 📤 Exportación de datos en CSV/PDF
- ⚡ Progressive Web App (PWA)

## Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + App Router
- **Styling**: Tailwind CSS
- **Estado**: Zustand
- **Backend**: AWS Amplify (GraphQL API)
- **Base de Datos**: Amazon DynamoDB
- **Autenticación**: Amazon Cognito
- **Testing**: Jest + React Testing Library

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

3. Inicializar Amplify (próximo paso):
```bash
npx amplify init
```

4. Ejecutar en desarrollo:
```bash
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar build de producción
- `npm run lint` - Ejecutar ESLint
- `npm run test` - Ejecutar tests
- `npm run test:watch` - Ejecutar tests en modo watch

## Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes React
│   ├── ui/             # Componentes UI reutilizables
│   └── layout/         # Componentes de layout
├── lib/                # Utilidades y configuración
├── types/              # Definiciones de tipos TypeScript
└── hooks/              # Custom hooks (próximo)
```

## Próximos Pasos

1. Configurar AWS Amplify Auth con Cognito
2. Implementar sistema de gestión de sesiones
3. Crear modelos de datos y configuración de base de datos
4. Desarrollar funcionalidades de registro de ingresos y gastos

## Despliegue

El proyecto está configurado para despliegue manual en AWS Amplify. Ver `amplify.yml` para la configuración de build.