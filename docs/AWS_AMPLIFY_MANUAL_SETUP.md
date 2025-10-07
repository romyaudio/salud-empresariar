# Configuración Manual de AWS Amplify

## Guía Paso a Paso para Configurar AWS Amplify desde la Consola

### Paso 1: Acceder a AWS Amplify Console

1. **Ir a AWS Console**: https://console.aws.amazon.com/
2. **Buscar "Amplify"** en la barra de búsqueda
3. **Seleccionar "AWS Amplify"**
4. **Región recomendada**: us-east-1 (Virginia del Norte)

### Paso 2: Crear Nueva Aplicación

1. **Clic en "Create new app"**
2. **Seleccionar "Build an app"**
3. **Nombre de la aplicación**: `budget-tracker`
4. **Clic en "Confirm deployment"**

### Paso 3: Configurar Autenticación (Amazon Cognito)

#### 3.1 Crear User Pool

1. **Ir a Amazon Cognito**: https://console.aws.amazon.com/cognito/
2. **Clic en "Create user pool"**
3. **Configuración recomendada**:

```
Authentication providers:
✓ Cognito user pool

Cognito user pool sign-in options:
✓ Email

Password policy:
- Minimum length: 8 characters
- Require numbers: ✓
- Require special characters: ✓
- Require uppercase letters: ✓
- Require lowercase letters: ✓

Multi-factor authentication (MFA):
○ No MFA (para simplicidad inicial)

User account recovery:
✓ Enable self-service account recovery
✓ Email only

Required attributes:
✓ email
✓ given_name (nombre)

Message delivery:
○ Send email with Cognito (para desarrollo)

User pool name: budget-tracker-users
```

4. **Clic en "Create user pool"**
5. **Anotar el User Pool ID** (formato: us-east-1_XXXXXXXXX)

#### 3.2 Crear App Client

1. **En el User Pool creado, ir a "App integration"**
2. **Clic en "Create app client"**
3. **Configuración**:

```
App type: Public client
App client name: budget-tracker-client

Authentication flows:
✓ ALLOW_USER_SRP_AUTH
✓ ALLOW_REFRESH_TOKEN_AUTH

OAuth 2.0 settings:
Callback URLs: 
- http://localhost:3000/
- https://tu-dominio.amplifyapp.com/

Sign out URLs:
- http://localhost:3000/auth
- https://tu-dominio.amplifyapp.com/auth

OAuth grant types:
✓ Authorization code grant

OAuth scopes:
✓ email
✓ openid
✓ profile
```

4. **Clic en "Create app client"**
5. **Anotar el Client ID** (formato: xxxxxxxxxxxxxxxxxxxxxxxxxx)

### Paso 4: Configurar API GraphQL (AWS AppSync)

#### 4.1 Crear API GraphQL

1. **Ir a AWS AppSync**: https://console.aws.amazon.com/appsync/
2. **Clic en "Create API"**
3. **Seleccionar "Build from scratch"**
4. **Configuración**:

```
API name: budget-tracker-api
Authorization mode: Amazon Cognito User Pool
User Pool: [Seleccionar el User Pool creado]
Default action: ALLOW
```

5. **Clic en "Create"**

#### 4.2 Definir Schema GraphQL

1. **En la API creada, ir a "Schema"**
2. **Reemplazar el schema por defecto con**:

```graphql
type Transaction @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  type: TransactionType!
  amount: Float!
  description: String!
  category: String!
  subcategory: String
  date: AWSDate!
  paymentMethod: PaymentMethod
  reference: String
  tags: [String]
  attachments: [String]
}

type Category @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  name: String!
  type: TransactionType!
  subcategories: [String]!
  color: String!
  icon: String
  isDefault: Boolean!
}

type Budget @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  name: String!
  category: String!
  amount: Float!
  period: BudgetPeriod!
  startDate: AWSDate!
  endDate: AWSDate!
  spent: Float!
  isActive: Boolean!
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum PaymentMethod {
  CASH
  CARD
  TRANSFER
  CHECK
  OTHER
}

enum BudgetPeriod {
  WEEKLY
  MONTHLY
  YEARLY
}
```

3. **Clic en "Save Schema"**
4. **Clic en "Create Resources"** (esto creará las tablas DynamoDB automáticamente)

#### 4.3 Obtener Endpoint GraphQL

1. **En la página principal de la API, anotar**:
   - **GraphQL endpoint URL** (formato: https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql)
   - **API ID**

### Paso 5: Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# AWS Amplify Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql

# Cambiar a modo producción
NEXT_PUBLIC_DEMO_MODE=false

# App Configuration
NEXT_PUBLIC_APP_NAME=Budget Tracker
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEFAULT_CURRENCY=COP
```

### Paso 6: Actualizar Configuración de Amplify en el Código

Actualizar `src/lib/amplify.ts`:

```typescript
import { Amplify } from 'aws-amplify';

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
        given_name: {
          required: true,
        },
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      defaultAuthMode: 'userPool' as const,
    },
  },
};

export function configureAmplify() {
  try {
    if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
      Amplify.configure(amplifyConfig);
      console.log('✅ Amplify configured successfully');
    } else {
      console.log('🔧 Running in demo mode');
    }
  } catch (error) {
    console.error('❌ Error configuring Amplify:', error);
  }
}

export const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};
```

### Paso 7: Configurar Hosting en Amplify

#### 7.1 Conectar Repositorio

1. **Volver a AWS Amplify Console**
2. **Seleccionar la app creada**
3. **Clic en "Connect repository"**
4. **Seleccionar "GitHub"**
5. **Autorizar AWS Amplify en GitHub**
6. **Seleccionar repositorio**: `salud-empresariar`
7. **Seleccionar rama**: `master`

#### 7.2 Configurar Build Settings

1. **Verificar que detecte `amplify.yml`**
2. **Si no existe, crear `amplify.yml` en la raíz**:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Installing dependencies..."
        - npm ci --prefer-offline --no-audit
        - echo "Running type check..."
        - npm run type-check
    build:
      commands:
        - echo "Building Next.js application..."
        - npm run build
        - echo "Build completed successfully!"
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
      - ~/.npm/**/*
```

#### 7.3 Configurar Variables de Entorno en Amplify

1. **En Amplify Console, ir a "Environment variables"**
2. **Agregar las siguientes variables**:

```
NEXT_PUBLIC_AWS_REGION = us-east-1
NEXT_PUBLIC_USER_POOL_ID = [Tu User Pool ID]
NEXT_PUBLIC_USER_POOL_CLIENT_ID = [Tu Client ID]
NEXT_PUBLIC_GRAPHQL_ENDPOINT = [Tu GraphQL Endpoint]
NEXT_PUBLIC_DEMO_MODE = false
NEXT_PUBLIC_APP_NAME = Budget Tracker
NEXT_PUBLIC_DEFAULT_CURRENCY = COP
```

### Paso 8: Desplegar

1. **Clic en "Save and deploy"**
2. **Monitorear el progreso del build**
3. **Una vez completado, obtener la URL de la aplicación**

### Paso 9: Verificar Configuración

#### 9.1 Test Local

```bash
# Instalar dependencias
npm install

# Verificar build
npm run build

# Ejecutar localmente
npm run dev
```

#### 9.2 Test en Producción

1. **Acceder a la URL de Amplify**
2. **Verificar que la autenticación funcione**
3. **Crear una cuenta de prueba**
4. **Probar registro de transacciones**

### Paso 10: Configuración de Dominio (Opcional)

1. **En Amplify Console, ir a "Domain management"**
2. **Clic en "Add domain"**
3. **Configurar dominio personalizado si tienes uno**

## Comandos Útiles

### Verificar Configuración Local
```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_USER_POOL_ID
echo $NEXT_PUBLIC_GRAPHQL_ENDPOINT

# Test de build
npm run build

# Verificar tipos
npm run type-check
```

### Debugging

#### Problemas Comunes

1. **"User is not authenticated"**:
   - Verificar User Pool ID y Client ID
   - Verificar que el usuario esté confirmado en Cognito

2. **"GraphQL errors"**:
   - Verificar endpoint GraphQL
   - Verificar que el schema esté desplegado
   - Verificar autorización en AppSync

3. **"Build failed"**:
   - Verificar variables de entorno en Amplify Console
   - Verificar que todas las dependencias estén en package.json

#### Logs Útiles

```bash
# Ver logs de Amplify build
# (Disponible en Amplify Console > Build logs)

# Ver logs de Cognito
# (Disponible en CloudWatch > Log groups > /aws/cognito/userpools)

# Ver logs de AppSync
# (Disponible en CloudWatch > Log groups > /aws/appsync/apis)
```

## Recursos Adicionales

- **AWS Amplify Documentation**: https://docs.amplify.aws/
- **Amazon Cognito Documentation**: https://docs.aws.amazon.com/cognito/
- **AWS AppSync Documentation**: https://docs.aws.amazon.com/appsync/
- **GraphQL Schema Reference**: https://docs.amplify.aws/cli/graphql/data-modeling/

## Checklist de Verificación

- [ ] User Pool creado en Cognito
- [ ] App Client configurado con URLs correctas
- [ ] API GraphQL creada en AppSync
- [ ] Schema GraphQL desplegado
- [ ] Variables de entorno configuradas
- [ ] Repositorio conectado a Amplify
- [ ] Build settings configurados
- [ ] Aplicación desplegada exitosamente
- [ ] Autenticación funcionando
- [ ] GraphQL API funcionando
- [ ] Transacciones se pueden crear/leer

---

**Tiempo estimado**: 30-45 minutos
**Costo estimado**: Gratis (dentro de los límites del free tier)