# Valores de Configuración para AWS Amplify

## Información que necesitas recopilar durante la configuración

### 1. Amazon Cognito User Pool

Después de crear el User Pool, anota estos valores:

```
User Pool ID: us-east-1_XXXXXXXXX
Ejemplo: us-east-1_AbC123DeF
```

### 2. Cognito App Client

Después de crear el App Client, anota:

```
Client ID: xxxxxxxxxxxxxxxxxxxxxxxxxx
Ejemplo: 1a2b3c4d5e6f7g8h9i0j1k2l3m
```

### 3. AWS AppSync GraphQL API

Después de crear la API GraphQL, anota:

```
GraphQL Endpoint: https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
Ejemplo: https://abcdefghijklmnopqrstuvwxyz.appsync-api.us-east-1.amazonaws.com/graphql

API ID: xxxxxxxxxxxxxxxxxxxxxxxxxx
Ejemplo: abcdefghijklmnopqrstuvwxyz
```

### 4. Archivo .env.local Final

Reemplaza los valores con los que obtuviste:

```env
# AWS Amplify Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=us-east-1_TU_USER_POOL_ID_AQUI
NEXT_PUBLIC_USER_POOL_CLIENT_ID=TU_CLIENT_ID_AQUI
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://TU_API_ID_AQUI.appsync-api.us-east-1.amazonaws.com/graphql

# Cambiar a modo producción
NEXT_PUBLIC_DEMO_MODE=false

# App Configuration
NEXT_PUBLIC_APP_NAME=Budget Tracker
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEFAULT_CURRENCY=COP
```

### 5. Variables de Entorno en Amplify Console

En AWS Amplify Console > Environment variables, agregar:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_AWS_REGION` | `us-east-1` |
| `NEXT_PUBLIC_USER_POOL_ID` | `us-east-1_TU_USER_POOL_ID` |
| `NEXT_PUBLIC_USER_POOL_CLIENT_ID` | `TU_CLIENT_ID` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://TU_API_ID.appsync-api.us-east-1.amazonaws.com/graphql` |
| `NEXT_PUBLIC_DEMO_MODE` | `false` |
| `NEXT_PUBLIC_APP_NAME` | `Budget Tracker` |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | `COP` |

## URLs de Callback para Cognito

Cuando configures el App Client, usa estas URLs:

### Para Desarrollo Local:
```
Callback URLs:
- http://localhost:3000/

Sign out URLs:
- http://localhost:3000/auth
```

### Para Producción (después del despliegue):
```
Callback URLs:
- https://TU_DOMINIO.amplifyapp.com/

Sign out URLs:
- https://TU_DOMINIO.amplifyapp.com/auth
```

## Verificación de Configuración

### Comando para verificar localmente:
```bash
# Crear archivo .env.local con los valores correctos
# Luego ejecutar:
npm run build
```

### Si todo está correcto, deberías ver:
```
✅ Amplify configured successfully
✓ Compiled successfully
```

### Si hay errores, verifica:
1. Que todos los IDs estén correctos
2. Que no haya espacios extra en las variables
3. Que el GraphQL endpoint esté accesible
4. Que el User Pool esté activo

## Orden de Configuración Recomendado

1. ✅ Crear User Pool en Cognito
2. ✅ Crear App Client en Cognito  
3. ✅ Crear API GraphQL en AppSync
4. ✅ Desplegar Schema GraphQL
5. ✅ Crear archivo .env.local
6. ✅ Probar build local
7. ✅ Configurar variables en Amplify Console
8. ✅ Conectar repositorio y desplegar

## Troubleshooting

### Error: "User Pool not found"
- Verificar que el User Pool ID sea correcto
- Verificar que esté en la región us-east-1

### Error: "GraphQL endpoint not accessible"
- Verificar que el endpoint esté correcto
- Verificar que la API esté desplegada
- Verificar que el schema esté guardado

### Error: "Authentication failed"
- Verificar Client ID
- Verificar que las URLs de callback estén configuradas
- Verificar que el usuario esté confirmado en Cognito