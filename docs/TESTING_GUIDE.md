# Guía de Pruebas - Budget Tracker

## ✅ Problema Resuelto

El error "Error al iniciar sesión. Inténtalo de nuevo." se debía a que el archivo `amplify_outputs.json` tenía configuraciones incorrectas que no coincidían con los recursos reales de AWS.

### 🔧 Cambios Realizados

1. **Actualización de User Pool ID:**
   - ❌ Anterior: `us-east-1_mLY333Rd4` (no existía)
   - ✅ Actual: `us-east-1_9LfPtwFIe` (existe y funciona)

2. **Actualización de Client ID:**
   - ❌ Anterior: `47t1hagoi676ri7hjfgobmk2at` (no válido)
   - ✅ Actual: `2ci7dpq70kgaf4hkc58bp8488g` (válido)

3. **Sincronización de archivos:**
   - ✅ `amplify_outputs.json` actualizado
   - ✅ `.env.local` actualizado
   - ✅ Configuración de Amplify corregida

## 🧪 Credenciales de Prueba

### Usuario de Prueba Creado
- **📧 Email:** `test@empresa.com`
- **🔑 Contraseña:** `TempPass123!`
- **✅ Estado:** Activo y verificado

## 🚀 Cómo Probar la Aplicación

### 1. Iniciar la Aplicación
```bash
npm run dev
```

### 2. Acceder a la Aplicación
- Abrir: http://localhost:3000
- Verás los indicadores de debug en desarrollo:
  - 🔍 **AuthDebug** (esquina superior izquierda): Muestra configuración de autenticación
  - 🟢 **ConnectionStatus** (esquina inferior derecha): Muestra estado de AWS DynamoDB

### 3. Iniciar Sesión
1. Hacer clic en "Iniciar Sesión" o ir a `/auth`
2. Usar las credenciales de prueba:
   - Email: `test@empresa.com`
   - Contraseña: `TempPass123!`
3. Deberías ser redirigido al dashboard principal

### 4. Probar Funcionalidades
- ✅ **Dashboard:** Ver resumen financiero
- ✅ **Ingresos:** Registrar nuevos ingresos
- ✅ **Gastos:** Registrar nuevos gastos
- ✅ **Categorías:** Crear y gestionar categorías personalizadas

## 🔍 Verificaciones Adicionales

### Verificar Conectividad AWS
```bash
npm run verify:cognito
```

### Verificar Configuración General
```bash
npm run test:aws
```

### Debug de Autenticación
```bash
npm run debug:auth
```

## 🐛 Solución de Problemas

### Si Aún Hay Errores de Login

1. **Verificar consola del navegador:**
   - Abrir DevTools (F12)
   - Ver errores en la consola
   - Los logs detallados aparecerán con 🚨

2. **Verificar indicadores de debug:**
   - AuthDebug debe mostrar "AWS Mode" en verde
   - ConnectionStatus debe mostrar "AWS DynamoDB" en verde

3. **Limpiar caché del navegador:**
   - Ctrl+Shift+R para recargar sin caché
   - O usar modo incógnito

### Si el Usuario No Funciona

Crear un nuevo usuario:
```bash
npm run create:user
```

O registrarse desde la aplicación:
1. Ir a `/auth`
2. Hacer clic en "Regístrate aquí"
3. Completar el formulario
4. Verificar email si es necesario

## 📊 Estado Actual

- **✅ Base de datos:** AWS DynamoDB conectada
- **✅ Autenticación:** AWS Cognito funcionando
- **✅ Usuario de prueba:** Creado y activo
- **✅ Aplicación:** Lista para usar

## 🎯 Próximos Pasos

1. **Probar todas las funcionalidades** con el usuario de prueba
2. **Crear más usuarios** si es necesario
3. **Registrar transacciones reales** para probar la persistencia
4. **Configurar categorías personalizadas**
5. **Verificar que los datos persisten** entre sesiones

---

## 📞 Soporte

Si encuentras algún problema:

1. **Revisar logs en consola** del navegador
2. **Ejecutar scripts de diagnóstico:**
   ```bash
   npm run debug:auth
   npm run verify:cognito
   npm run test:aws
   ```
3. **Verificar que AWS CLI esté configurado** correctamente

✅ **Tu aplicación está ahora completamente funcional con AWS DynamoDB y Cognito**