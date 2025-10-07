# Configuración de Base de Datos AWS DynamoDB

## ✅ Estado Actual

Tu aplicación está **configurada para usar AWS DynamoDB** como base de datos real.

### Configuración Activa

- **Base de datos:** AWS DynamoDB
- **Región:** us-east-1 (Virginia del Norte)
- **User Pool ID:** us-east-1_mLY333Rd4
- **GraphQL Endpoint:** https://n2sv2ieosfcejl742dgioju3ra.appsync-api.us-east-1.amazonaws.com/graphql
- **Modo Demo:** ❌ DESACTIVADO

## 📊 Tablas de Base de Datos

### 1. Transaction (Transacciones)
- **Propósito:** Almacena ingresos y gastos
- **Campos principales:**
  - `id` - Identificador único
  - `type` - INCOME o EXPENSE
  - `amount` - Monto de la transacción
  - `description` - Descripción
  - `category` - Categoría
  - `date` - Fecha de la transacción
  - `owner` - Usuario propietario (automático)

### 2. Category (Categorías)
- **Propósito:** Categorías personalizables para organizar transacciones
- **Campos principales:**
  - `id` - Identificador único
  - `name` - Nombre de la categoría
  - `type` - INCOME o EXPENSE
  - `subcategories` - Lista de subcategorías
  - `color` - Color para la UI
  - `owner` - Usuario propietario (automático)

### 3. Budget (Presupuestos)
- **Propósito:** Límites de gasto por categoría
- **Campos principales:**
  - `id` - Identificador único
  - `name` - Nombre del presupuesto
  - `category` - Categoría asociada
  - `amount` - Monto límite
  - `period` - WEEKLY, MONTHLY, YEARLY
  - `owner` - Usuario propietario (automático)

## 🔐 Seguridad

- **Autenticación:** AWS Cognito User Pools
- **Autorización:** Cada usuario solo puede ver sus propios datos
- **Encriptación:** Los datos se almacenan encriptados en DynamoDB

## 🚀 Cómo Usar

### 1. Iniciar la Aplicación
```bash
npm run dev
```

### 2. Registrarse o Iniciar Sesión
- Ve a http://localhost:3000
- Crea una cuenta nueva o inicia sesión
- Los datos se guardarán automáticamente en AWS

### 3. Verificar Conexión
```bash
npm run test:aws
```

## 🔧 Comandos Útiles

### Verificar Estado de la Base de Datos
```bash
npm run test:aws
```

### Ver Logs de Amplify
```bash
npx amplify status
```

### Actualizar Esquema de Base de Datos
```bash
npx amplify push
```

## 🎯 Diferencias con Modo Demo

| Aspecto | Modo Demo | AWS DynamoDB |
|---------|-----------|--------------|
| **Persistencia** | ❌ Se pierde al reiniciar | ✅ Permanente |
| **Usuarios** | ❌ Un solo usuario demo | ✅ Múltiples usuarios reales |
| **Seguridad** | ❌ Sin autenticación | ✅ Autenticación completa |
| **Escalabilidad** | ❌ Limitado | ✅ Escalable automáticamente |
| **Costo** | ✅ Gratis | 💰 Según uso (muy bajo para desarrollo) |

## 🐛 Solución de Problemas

### Error de Autenticación
```bash
# Verificar configuración
npm run test:aws

# Limpiar caché de Amplify
rm -rf .amplify
npx amplify pull
```

### Datos No Se Guardan
1. Verificar que `NEXT_PUBLIC_DEMO_MODE=false` en `.env.local`
2. Verificar que el usuario esté autenticado
3. Revisar la consola del navegador para errores

### Cambiar de Vuelta a Modo Demo
```bash
# En .env.local
NEXT_PUBLIC_DEMO_MODE=true
```

## 📈 Monitoreo

- **AWS Console:** https://console.aws.amazon.com/dynamodb/
- **AppSync Console:** https://console.aws.amazon.com/appsync/
- **Cognito Console:** https://console.aws.amazon.com/cognito/

## 💡 Próximos Pasos

1. **Crear categorías personalizadas** en la sección Categorías
2. **Registrar transacciones** en Ingresos y Gastos
3. **Configurar presupuestos** para controlar gastos
4. **Ver reportes** en el Dashboard

---

✅ **Tu aplicación está lista para usar con AWS DynamoDB**