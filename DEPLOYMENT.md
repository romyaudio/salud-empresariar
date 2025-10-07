# Guía de Despliegue en AWS Amplify

## Proceso de Despliegue Manual

### 1. Preparación Local

Antes de cada despliegue, ejecuta el script de preparación:

```bash
npm run deploy:prepare
```

Este script realizará:
- ✅ Verificación de archivos críticos
- ✅ Instalación limpia de dependencias
- ✅ Verificación de tipos TypeScript
- ✅ Ejecución de tests
- ✅ Verificación de ESLint
- ✅ Build de producción

### 2. Subir Cambios a GitHub

```bash
git add .
git commit -m "feat: nueva funcionalidad implementada"
git push origin main
```

### 3. Configuración Inicial en AWS Amplify

#### Primera vez solamente:

1. **Accede a AWS Amplify Console**
   - Ve a https://console.aws.amazon.com/amplify/
   - Selecciona tu región (recomendado: us-east-1)

2. **Conectar Repositorio**
   - Clic en "New app" → "Host web app"
   - Selecciona "GitHub" como proveedor
   - Autoriza AWS Amplify en GitHub
   - Selecciona tu repositorio `budget-tracker`
   - Selecciona la rama `main`

3. **Configurar Build Settings**
   - Amplify detectará automáticamente `amplify.yml`
   - Verifica que la configuración sea correcta
   - Modifica si es necesario

4. **Variables de Entorno**
   ```
   NEXT_PUBLIC_APP_NAME=Budget Tracker
   NEXT_PUBLIC_DEFAULT_CURRENCY=COP
   ```

5. **Configuraciones Avanzadas**
   - **Build image**: Amazon Linux:2023
   - **Node.js version**: 18.x o superior
   - **Package manager**: npm

### 4. Despliegue

#### Despliegue Automático (recomendado):
- Cada push a `main` disparará un despliegue automático
- Monitorea el progreso en la consola de Amplify

#### Despliegue Manual:
1. Ve a tu app en Amplify Console
2. Clic en "Run build" en la rama main
3. Monitorea el progreso del build

### 5. Verificación Post-Despliegue

#### Checklist de Verificación:
- [ ] La aplicación carga correctamente
- [ ] Todas las rutas funcionan
- [ ] Los formularios se envían correctamente
- [ ] La navegación móvil funciona
- [ ] Los datos se guardan y recuperan
- [ ] No hay errores en la consola del navegador

#### URLs de Verificación:
- **Producción**: `https://[app-id].amplifyapp.com`
- **Staging**: `https://[branch].[app-id].amplifyapp.com`

### 6. Rollback (si es necesario)

En caso de problemas:

1. **Rollback Rápido**:
   - Ve a Amplify Console
   - Selecciona "Deployments"
   - Clic en "Promote to production" en una versión anterior

2. **Rollback por Git**:
   ```bash
   git revert [commit-hash]
   git push origin main
   ```

### 7. Monitoreo

#### Métricas a Monitorear:
- **Performance**: Tiempo de carga de páginas
- **Errores**: Logs de errores en CloudWatch
- **Tráfico**: Número de visitantes únicos
- **Disponibilidad**: Uptime de la aplicación

#### Acceso a Logs:
- Ve a Amplify Console → tu app → "Monitoring"
- Revisa CloudWatch Logs para errores detallados

## Comandos Útiles

```bash
# Preparar para despliegue
npm run deploy:prepare

# Build local para testing
npm run build

# Verificar tipos
npm run type-check

# Ejecutar tests
npm test

# Analizar bundle
npm run analyze
```

## Solución de Problemas Comunes

### Build Falla
1. Verifica que todas las dependencias estén en `package.json`
2. Ejecuta `npm run deploy:prepare` localmente
3. Revisa los logs de build en Amplify Console

### Aplicación No Carga
1. Verifica las variables de entorno
2. Revisa la configuración de `next.config.js`
3. Verifica que `amplify.yml` esté configurado correctamente

### Errores de Routing
1. Verifica que `trailingSlash: true` esté en `next.config.js`
2. Asegúrate de que todas las rutas estén definidas correctamente

## Contacto y Soporte

Para problemas técnicos:
1. Revisa los logs en Amplify Console
2. Verifica la documentación de AWS Amplify
3. Consulta la documentación de Next.js

---

**Última actualización**: $(date)
**Versión**: 1.0.0