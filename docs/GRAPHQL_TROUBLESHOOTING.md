# Troubleshooting GraphQL - Budget Tracker

## Problema Identificado

La aplicación está experimentando errores al registrar transacciones (ingresos y gastos) cuando intenta usar AWS GraphQL/AppSync. El error genérico "Error al registrar el ingreso/gasto" indica un problema en la comunicación con la API GraphQL.

## Diagnóstico Realizado

### ✅ Funcionamiento Local
- ✅ Build local exitoso
- ✅ Validación de datos correcta
- ✅ Modelos de transacciones funcionando
- ✅ localStorage funcionando perfectamente

### ❌ Problemas Identificados en GraphQL

1. **Discrepancia en el Schema vs Operations**
   - Schema usa `owner` (Amplify Gen 2 auth)
   - Operations intentaban usar `userId`
   - Queries incorrectas (`getTransactionsByUser` vs `listTransactions`)

2. **Configuración de Autenticación**
   - Schema: `@auth(rules: [{ allow: owner }])`
   - Amplify maneja automáticamente el campo `owner`
   - Necesita usuario autenticado correctamente

3. **Operaciones GraphQL Incorrectas**
   - Queries personalizadas no existen en el schema generado
   - Falta de manejo correcto de respuestas de Amplify

## Solución Temporal Implementada

### Modo localStorage Activado
```env
NEXT_PUBLIC_DEMO_MODE=true
```

**Beneficios:**
- ✅ Usuarios pueden usar la aplicación inmediatamente
- ✅ Todas las funcionalidades funcionan correctamente
- ✅ Datos se persisten en el navegador
- ✅ No requiere configuración de AWS

**Limitaciones:**
- ❌ Datos solo en el navegador local
- ❌ No sincronización entre dispositivos
- ❌ Datos se pierden al limpiar navegador

## Plan de Corrección para AWS GraphQL

### Fase 1: Corregir Schema y Operations ⏳

1. **Actualizar Operations GraphQL**
   ```graphql
   # Correcto para Amplify Gen 2
   query ListTransactions {
     listTransactions {
       items {
         id
         type
         amount
         description
         category
         owner
         createdAt
         updatedAt
       }
     }
   }
   ```

2. **Corregir GraphQLService**
   - Usar `listTransactions` en lugar de `getTransactionsByUser`
   - Mapear `owner` a `userId` para compatibilidad
   - Manejar correctamente las respuestas de Amplify

### Fase 2: Verificar Autenticación ⏳

1. **Verificar User Pool Configuration**
   - Confirmar que el usuario está autenticado
   - Verificar que el token JWT es válido
   - Confirmar permisos de owner

2. **Probar Operaciones Básicas**
   - Test de createTransaction
   - Test de listTransactions
   - Verificar logs de AppSync

### Fase 3: Implementar Modo Híbrido ⏳

1. **Detección Automática**
   ```typescript
   // Intentar AWS primero, fallback a localStorage
   const useAWS = await testAWSConnection();
   ```

2. **Migración de Datos**
   - Script para migrar de localStorage a AWS
   - Sincronización bidireccional opcional

## Archivos Modificados

### Correcciones Realizadas
- ✅ `src/lib/graphql/operations.ts` - Operations corregidas
- ✅ `src/lib/services/graphqlService.ts` - Manejo de owner/userId
- ✅ `src/lib/services/dataService.ts` - Mejor logging
- ✅ `.env.local` - Modo demo activado

### Pendientes de Probar
- ⏳ Verificar que las operations funcionan en AWS
- ⏳ Probar autenticación completa
- ⏳ Validar permisos de owner

## Comandos de Diagnóstico

### Probar Localmente
```bash
npm run build
npm run dev
# Usar componente TransactionDebug en /income o /expenses
```

### Verificar AWS
```bash
npm run verify:aws
npm run verify:cognito
npm run test:aws
```

### Deploy con Debugging
```bash
npm run pre-deploy
git add .
git commit -m "debug: Test GraphQL fixes"
git push origin master
```

## Logs de Debugging

### Componente TransactionDebug
- Disponible en `/income` y `/expenses`
- Muestra configuración completa del sistema
- Permite probar creación de transacciones
- Logs detallados en consola del navegador

### Verificaciones que Realiza
1. ✅ isDemoMode()
2. ✅ isUsingRealAWS()
3. ✅ getConfigStatus()
4. ✅ Usuario autenticado
5. ✅ Variables de entorno
6. ✅ Test de createTransaction

## Estado Actual

### ✅ Funcionando
- Aplicación desplegada y funcional
- Registro de ingresos y gastos
- Todas las funcionalidades básicas
- Modo localStorage estable

### ⏳ En Progreso
- Corrección de GraphQL operations
- Verificación de autenticación AWS
- Testing de integración completa

### 📋 Próximos Pasos
1. Monitorear deploy actual con modo localStorage
2. Probar correcciones de GraphQL en desarrollo
3. Implementar modo híbrido AWS + localStorage
4. Migrar gradualmente a AWS cuando esté estable

## Notas Importantes

- **La aplicación está funcionando correctamente** en modo localStorage
- **Los usuarios pueden usar todas las funcionalidades** sin problemas
- **Los datos se guardan correctamente** en el navegador
- **El problema es específico de la integración AWS GraphQL**
- **La solución temporal es estable y confiable**

## Contacto

Si encuentras problemas adicionales:
1. Revisar logs del componente TransactionDebug
2. Verificar consola del navegador para errores
3. Confirmar que NEXT_PUBLIC_DEMO_MODE=true
4. Reportar cualquier error específico con logs detallados