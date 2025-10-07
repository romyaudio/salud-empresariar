# Documento de Diseño

## Visión General

La aplicación de presupuesto será una Progressive Web App (PWA) construida con Next.js y TypeScript, optimizada para dispositivos móviles. Utilizará AWS Amplify para el backend, autenticación y hosting, con una base de datos DynamoDB para escalabilidad. La arquitectura seguirá patrones de diseño modernos con separación clara de responsabilidades.

## Arquitectura

### Stack Tecnológico
- **Frontend**: Next.js 14 + TypeScript + App Router
- **Styling**: Tailwind CSS para diseño responsive móvil-first
- **Estado**: Zustand para manejo de estado global
- **Backend**: AWS Amplify (API GraphQL, Auth, Storage)
- **Base de Datos**: Amazon DynamoDB
- **Autenticación**: Amazon Cognito
- **Hosting**: AWS Amplify Hosting
- **Testing**: Jest + React Testing Library

### Arquitectura de Capas
```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│ (Next.js Pages/Components + Tailwind)│
├─────────────────────────────────────┤
│           Business Logic Layer      │
│  (Custom Hooks + Server Actions)   │
├─────────────────────────────────────┤
│           Data Access Layer        │
│    (Amplify GraphQL + API calls)   │
├─────────────────────────────────────┤
│           Infrastructure Layer      │
│  (AWS Amplify + DynamoDB + Cognito)│
└─────────────────────────────────────┘
```

## Componentes e Interfaces

### Estructura de Componentes Principales

#### 1. Layout Components
- **AppLayout**: Contenedor principal con navegación móvil
- **MobileNavigation**: Barra de navegación inferior para móviles
- **Header**: Encabezado con información de usuario y balance

#### 2. Feature Components
- **Dashboard**: Resumen financiero con gráficos
- **IncomeForm**: Formulario para registrar ingresos
- **ExpenseForm**: Formulario para registrar gastos
- **TransactionList**: Lista de transacciones recientes
- **CategoryManager**: Gestión de categorías de gastos
- **ExportData**: Funcionalidad de exportación

#### 3. UI Components
- **Button**: Componente de botón reutilizable
- **Input**: Campos de entrada con validación
- **Select**: Selector de opciones
- **Modal**: Ventanas modales para confirmaciones
- **LoadingSpinner**: Indicador de carga
- **ErrorBoundary**: Manejo de errores

### Interfaces TypeScript Principales

```typescript
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  subcategories: string[];
  userId: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  currency: string;
  dateFormat: string;
  defaultCategories: string[];
}

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyData: MonthlyData[];
  categoryBreakdown: CategoryBreakdown[];
}
```

## Modelos de Datos

### Esquema DynamoDB

#### Tabla: Transactions
```
PK: USER#{userId}
SK: TRANSACTION#{timestamp}#{transactionId}
GSI1PK: USER#{userId}#TYPE#{type}
GSI1SK: DATE#{date}
```

#### Tabla: Categories
```
PK: USER#{userId}
SK: CATEGORY#{categoryId}
```

#### Tabla: UserProfiles
```
PK: USER#{userId}
SK: PROFILE
```

### Patrones de Acceso a Datos
1. Obtener todas las transacciones de un usuario
2. Obtener transacciones por tipo (ingreso/gasto)
3. Obtener transacciones por rango de fechas
4. Obtener transacciones por categoría
5. Obtener resumen mensual/anual

## Manejo de Errores

### Estrategia de Manejo de Errores
1. **Errores de Red**: Retry automático con backoff exponencial
2. **Errores de Validación**: Mensajes claros en el formulario
3. **Errores de Autenticación**: Redirección a login
4. **Errores de Servidor**: Mensajes amigables al usuario
5. **Errores Inesperados**: Error Boundary con opción de reporte

### Implementación
```typescript
class ErrorHandler {
  static handleApiError(error: any): string {
    if (error.networkError) return 'Error de conexión. Verifica tu internet.';
    if (error.graphQLErrors?.length) return error.graphQLErrors[0].message;
    return 'Ha ocurrido un error inesperado.';
  }
}
```

## Estrategia de Testing

### Niveles de Testing
1. **Unit Tests**: Componentes individuales y funciones utilitarias
2. **Integration Tests**: Flujos completos de usuario
3. **E2E Tests**: Funcionalidades críticas end-to-end

### Herramientas y Configuración
- **Jest**: Framework de testing integrado con Next.js
- **React Testing Library**: Testing de componentes React
- **MSW**: Mock Service Worker para APIs
- **Playwright**: Tests E2E (opcional para funcionalidades críticas)

### Cobertura Objetivo
- Componentes principales: 90%+
- Funciones de negocio: 95%+
- Flujos críticos: 100%

## Diseño Móvil-First

### Breakpoints
```css
/* Mobile First */
.container { /* Base: 320px+ */ }
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
```

### Patrones de Navegación
- **Bottom Tab Navigation**: Navegación principal en la parte inferior
- **Swipe Gestures**: Para cambiar entre secciones
- **Pull to Refresh**: Para actualizar datos
- **Floating Action Button**: Para acciones principales (agregar transacción)

### Optimizaciones de Performance
- **Lazy Loading**: Componentes y rutas
- **Virtual Scrolling**: Para listas largas de transacciones
- **Image Optimization**: Compresión automática
- **Bundle Splitting**: Código dividido por rutas

## Seguridad

### Autenticación y Autorización
- **Amazon Cognito**: Manejo completo de usuarios
- **JWT Tokens**: Autenticación stateless
- **MFA**: Autenticación multifactor opcional
- **Session Management**: Expiración automática de sesiones

### Protección de Datos
- **Encriptación en Tránsito**: HTTPS obligatorio
- **Encriptación en Reposo**: DynamoDB encriptado
- **Validación de Entrada**: Sanitización de todos los inputs
- **Rate Limiting**: Protección contra ataques de fuerza bruta

## Despliegue y CI/CD

### Estrategia de Despliegue Manual
1. **Desarrollo Local**: Amplify CLI para desarrollo
2. **Testing**: Ejecución completa de tests antes de despliegue
3. **Build**: Generación de build optimizado
4. **Deploy Manual**: Comando específico para despliegue controlado
5. **Verificación**: Checklist post-despliegue

### Configuración AWS Amplify
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npm run test
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### Control de Versiones
- **Semantic Versioning**: vX.Y.Z
- **Feature Branches**: Una rama por funcionalidad
- **Pull Requests**: Revisión obligatoria de código
- **Tags**: Marcado de versiones para rollback rápido