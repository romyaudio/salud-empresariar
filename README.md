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

## Despliegue en AWS Amplify

### Despliegue Automático desde GitHub

1. **Conectar Repositorio**:
   - Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Selecciona "Host web app"
   - Conecta tu repositorio de GitHub: `https://github.com/romyaudio/salud-empresariar.git`
   - Selecciona la rama `master`

2. **Configuración de Build**:
   - Amplify detectará automáticamente el archivo `amplify.yml`
   - La configuración incluye:
     - Instalación de dependencias con `npm ci`
     - Ejecución de tests
     - Build de producción con `npm run build`
     - Optimización de archivos estáticos

3. **Variables de Entorno** (Opcional para AWS Cognito):
   ```
   NEXT_PUBLIC_AWS_REGION=us-east-1
   NEXT_PUBLIC_USER_POOL_ID=us-east-1_XXXXXXXXX
   NEXT_PUBLIC_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_DEMO_MODE=false
   ```

4. **Dominio Personalizado** (Opcional):
   - Configura un dominio personalizado en la consola de Amplify
   - Amplify manejará automáticamente el certificado SSL

### Características del Despliegue

- ✅ **Build Automático**: Cada push a `master` despliega automáticamente
- ✅ **HTTPS**: SSL/TLS automático con certificados gratuitos
- ✅ **CDN Global**: CloudFront para distribución mundial
- ✅ **Modo Demo**: Funciona sin configuración adicional de AWS
- ✅ **Escalabilidad**: Auto-scaling basado en tráfico
- ✅ **Monitoreo**: Métricas y logs integrados

### URL de Despliegue

Una vez desplegado, la aplicación estará disponible en:
`https://master.XXXXXXXXXX.amplifyapp.com`

### Configuración Local para Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/romyaudio/salud-empresariar.git
cd salud-empresariar

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```