# Guía de Seguridad - Budget Tracker

## 🔒 Archivos Sensibles

### ⚠️ IMPORTANTE: Archivos que NO deben subirse a Git

Los siguientes archivos contienen información sensible y están excluidos del repositorio:

#### 1. `amplify_outputs.json`
- **Contiene:** User Pool IDs, Client IDs, GraphQL endpoints
- **Riesgo:** Acceso no autorizado a tu infraestructura AWS
- **Estado:** ✅ Agregado a .gitignore

#### 2. `.env.local` y archivos `.env*`
- **Contiene:** Variables de entorno con credenciales
- **Riesgo:** Exposición de configuración sensible
- **Estado:** ✅ Ya estaba en .gitignore

## 🛡️ Configuración Segura

### Para Desarrolladores

1. **Configurar amplify_outputs.json localmente:**
   ```bash
   npm run setup:outputs
   ```

2. **Verificar que el archivo esté ignorado:**
   ```bash
   git status
   # amplify_outputs.json NO debe aparecer en la lista
   ```

3. **Usar el archivo de ejemplo como referencia:**
   - `amplify_outputs.example.json` - Versión sin datos sensibles
   - Reemplazar valores XXXXXXXXX con datos reales

### Para Producción

1. **AWS Amplify Console:**
   - Los valores se configuran automáticamente
   - No necesitas subir amplify_outputs.json

2. **Variables de entorno:**
   - Configurar en la plataforma de hosting
   - Usar variables de entorno en lugar de archivos

## 🔍 Verificación de Seguridad

### Comandos de Verificación

```bash
# Verificar que archivos sensibles estén ignorados
git ls-files | grep -E "(amplify_outputs\.json|\.env\.local)"
# No debe devolver resultados

# Verificar configuración actual
npm run debug:auth

# Verificar conectividad AWS
npm run verify:cognito
```

### Checklist de Seguridad

- [ ] `amplify_outputs.json` está en .gitignore
- [ ] `.env.local` está en .gitignore  
- [ ] No hay credenciales hardcodeadas en el código
- [ ] Variables de entorno configuradas correctamente
- [ ] Archivos sensibles no están en Git

## 🚨 Qué Hacer Si Se Expusieron Credenciales

### Si subiste amplify_outputs.json por error:

1. **Eliminar del historial de Git:**
   ```bash
   git rm --cached amplify_outputs.json
   git commit -m "Remove sensitive amplify_outputs.json"
   git push
   ```

2. **Regenerar credenciales en AWS:**
   - Ir a AWS Cognito Console
   - Crear nuevo User Pool Client
   - Actualizar configuración local

3. **Verificar que esté en .gitignore:**
   ```bash
   echo "amplify_outputs.json" >> .gitignore
   git add .gitignore
   git commit -m "Add amplify_outputs.json to gitignore"
   ```

### Si expusiste otras credenciales:

1. **Rotar inmediatamente** todas las credenciales expuestas
2. **Revisar logs de AWS** para actividad sospechosa
3. **Actualizar** todas las configuraciones locales

## 📋 Buenas Prácticas

### Desarrollo Local

1. **Nunca hardcodear credenciales** en el código
2. **Usar variables de entorno** para configuración
3. **Verificar .gitignore** antes de cada commit
4. **Usar archivos .example** para documentar estructura

### Colaboración en Equipo

1. **Compartir solo archivos .example**
2. **Documentar** proceso de configuración
3. **Usar scripts** para configuración automática
4. **Verificar** que cada desarrollador configure correctamente

### Producción

1. **Usar variables de entorno** de la plataforma
2. **No incluir** archivos de configuración en builds
3. **Monitorear** accesos y uso de recursos
4. **Rotar credenciales** periódicamente

## 🔧 Scripts de Seguridad

```bash
# Configurar archivos sensibles
npm run setup:outputs

# Verificar configuración
npm run debug:auth

# Verificar conectividad
npm run verify:cognito

# Limpiar archivos sensibles (si es necesario)
rm amplify_outputs.json .env.local
```

## 📞 Soporte

Si tienes dudas sobre seguridad:

1. **Revisar esta documentación**
2. **Ejecutar scripts de verificación**
3. **Consultar documentación de AWS Amplify**
4. **Revisar logs de la aplicación**

---

## ⚠️ RECORDATORIO IMPORTANTE

**NUNCA subas archivos con credenciales reales a repositorios públicos.**

Los archivos sensibles están protegidos por .gitignore, pero siempre verifica antes de hacer commit.