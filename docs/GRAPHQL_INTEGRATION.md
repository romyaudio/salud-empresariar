# Integración GraphQL con AWS AppSync

## Resumen

La aplicación Budget Tracker ahora incluye integración completa con AWS AppSync GraphQL API, permitiendo almacenamiento y sincronización de datos en la nube.

## Arquitectura

### Modo Dual: Demo y Producción

La aplicación funciona en dos modos:

1. **Modo Demo** (`NEXT_PUBLIC_DEMO_MODE=true`):
   - Usa datos locales (localStorage)
   - No requiere configuración de AWS
   - Ideal para desarrollo y pruebas

2. **Modo Producción** (`NEXT_PUBLIC_DEMO_MODE=false`):
   - Usa AWS AppSync GraphQL API
   - Autenticación con Amazon Cognito
   - Datos almacenados en DynamoDB

### Servicios Implementados

#### 1. GraphQLService (`src/lib/services/graphqlService.ts`)
- Maneja todas las operaciones GraphQL
- Incluye fallback a datos mock en modo demo
- Operaciones CRUD para transacciones, categorías y presupuestos

#### 2. DataService Actualizado (`src/lib/services/dataService.ts`)
- Detecta automáticamente el modo (demo/producción)
- Redirige llamadas a GraphQLService cuando está en producción
- Mantiene compatibilidad con el modo demo

#### 3. Esquema GraphQL (`amplify/backend/api/budgettracker/schema.graphql`)
- Definición completa de tipos de datos
- Autorización basada en propietario (owner-based)
- Resolvers automáticos generados por Amplify

## Configuración

### Variables de Entorno

```env
# AWS Amplify Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql

# Modo de operación
NEXT_PUBLIC_DEMO_MODE=false  # true para demo, false para producción
```

### Configuración de Amplify

1. **Instalar Amplify CLI**:
   ```bash
   npm run setup:amplify
   ```

2. **Inicializar proyecto**:
   ```bash
   amplify init
   ```

3. **Agregar autenticación**:
   ```bash
   amplify add auth
   ```

4. **Agregar API GraphQL**:
   ```bash
   amplify add api
   ```

5. **Desplegar recursos**:
   ```bash
   amplify push
   ```

## Operaciones GraphQL

### Transacciones

#### Crear Transacción
```graphql
mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    id
    type
    amount
    description
    category
    date
    createdAt
  }
}
```

#### Obtener Transacciones
```graphql
query ListTransactions($filter: ModelTransactionFilterInput) {
  listTransactions(filter: $filter) {
    items {
      id
      type
      amount
      description
      category
      date
      createdAt
    }
  }
}
```

### Categorías

#### Crear Categoría
```graphql
mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    id
    name
    type
    color
    subcategories
  }
}
```

#### Obtener Categorías
```graphql
query ListCategories($filter: ModelCategoryFilterInput) {
  listCategories(filter: $filter) {
    items {
      id
      name
      type
      color
      subcategories
    }
  }
}
```

## Seguridad

### Autorización
- **Owner-based**: Cada usuario solo puede acceder a sus propios datos
- **Amazon Cognito**: Autenticación de usuarios
- **JWT Tokens**: Autorización de requests

### Reglas de Acceso
```graphql
type Transaction @model @auth(rules: [{ allow: owner }]) {
  # Solo el propietario puede leer, crear, actualizar y eliminar
}
```

## Manejo de Errores

### Estrategias Implementadas

1. **Fallback a Demo**: Si AWS no está configurado, usa datos locales
2. **Retry Logic**: Reintentos automáticos en errores de red
3. **Error Messages**: Mensajes de error claros para el usuario
4. **Logging**: Logs detallados para debugging

### Ejemplo de Manejo
```typescript
try {
  const result = await GraphQLService.createTransaction(data);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
} catch (error) {
  console.error('Error creating transaction:', error);
  // Fallback o mensaje de error al usuario
}
```

## Testing

### Modo Demo
- Todos los tests pueden ejecutarse sin configuración de AWS
- Datos mock predefinidos
- Respuestas simuladas de API

### Modo Producción
- Requiere configuración de AWS
- Tests de integración con AppSync
- Validación de autorización

## Migración de Datos

### De Demo a Producción
1. Exportar datos del localStorage
2. Configurar AWS Amplify
3. Importar datos via GraphQL mutations
4. Cambiar `NEXT_PUBLIC_DEMO_MODE=false`

### Script de Migración (Futuro)
```bash
npm run migrate:demo-to-aws
```

## Monitoreo

### Métricas Disponibles
- **AWS CloudWatch**: Métricas de AppSync
- **Request Latency**: Tiempo de respuesta de queries
- **Error Rate**: Tasa de errores de API
- **Usage**: Número de requests por usuario

### Logs
- **Client-side**: Console logs para debugging
- **Server-side**: CloudWatch logs de resolvers
- **Authentication**: Cognito logs de autenticación

## Optimizaciones

### Performance
- **Caching**: Cache automático de queries
- **Batch Operations**: Múltiples operaciones en una request
- **Pagination**: Paginación automática para listas grandes

### Costos
- **Query Optimization**: Queries eficientes para reducir costos
- **Data Filtering**: Filtros en el servidor para reducir transferencia
- **Connection Pooling**: Reutilización de conexiones

## Próximos Pasos

1. **Subscriptions**: Actualizaciones en tiempo real
2. **Offline Support**: Sincronización offline
3. **Data Sync**: Sincronización entre dispositivos
4. **Advanced Queries**: Búsquedas y filtros avanzados
5. **Analytics**: Integración con Amazon Pinpoint

## Troubleshooting

### Problemas Comunes

1. **"Amplify has not been configured"**:
   - Verificar variables de entorno
   - Ejecutar `configureAmplify()` en `_app.tsx`

2. **"User is not authenticated"**:
   - Verificar token de Cognito
   - Re-autenticar usuario

3. **"GraphQL errors"**:
   - Verificar schema y resolvers
   - Revisar permisos de autorización

### Comandos de Diagnóstico
```bash
# Verificar configuración
amplify status

# Ver logs de API
amplify console api

# Verificar autenticación
amplify console auth
```

---

**Última actualización**: $(date)
**Versión**: 1.0.0