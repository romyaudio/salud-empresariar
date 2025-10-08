# Guía de Despliegue - Budget Tracker

## Índice

1. [Prerequisitos](#prerequisitos)
2. [Preparación del Entorno](#preparación-del-entorno)
3. [Despliegue Manual](#despliegue-manual)
4. [Configuración Post-Despliegue](#configuración-post-despliegue)
5. [Verificación](#verificación)
6. [Troubleshooting](#troubleshooting)
7. [Mantenimiento](#mantenimiento)

## Prerequisitos

### Herramientas Requeridas

- **Node.js** 18.0 o superior
- **npm** 8.0 o superior
- **Git** 2.0 o superior
- **Cuenta AWS** con permisos de Amplify
- **Repositorio Git** (GitHub, GitLab, Bitbucket, etc.)

### Verificación de Prerequisitos

```bash
# Verificar versiones
node --version    # Debe ser >= 18.0
npm --version     # Debe ser >= 8.0
git --version     # Debe ser >= 2.0

# Ejecutar script de verificación
npm run pre-deploy
```

## Preparación del Entorno

### 1. Configuración Local

```bash
# Clonar el repositorio
git clone <tu-repositorio-url>
cd budget-tracker

# Instalar dependencias
npm install

# Verificar que todo funciona localmente
npm run dev
```

### 2. Variables de Entorno

Crear archivo `.env.local` para desarrollo:

```env
# Desarrollo local
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
```

Para producción, las variables se configuran en AWS Amplify Console.

### 3. Configuración de AWS

1. **Crear cuenta AWS** (si no tienes una)
2. **Configurar permisos IAM** para Amplify
3. **Verificar límites de servicio** en tu región

## Despliegue Manual

### Opción 1: Script Automatizado

```bash
# Ejecutar guía interactiva de despliegue
node scripts/deploy-manual.js
```

### Opción 2: Paso a Paso Manual

#### Paso 1: Preparación del Código

```bash
# Ejecutar todas las verificaciones
npm run pre-deploy

# Verificar que el build funciona
npm run build
npm run validate-build
```

#### Paso 2: Configurar AWS Amplify

1. **Acceder a AWS Console**
   - Ve a https://console.aws.amazon.com/amplify/
   - Selecciona tu región preferida

2. **Crear Nueva Aplicación**
   - Clic en "New app" → "Host web app"
   - Selecciona tu proveedor Git
   - Autoriza AWS Amplify

3. **Configurar Repositorio**
   - Selecciona el repositorio del Budget Tracker
   - Selecciona la rama `main`
   - Amplify detectará automáticamente `amplify.yml`

#### Paso 3: Configuración de Build

```yaml
# amplify.yml ya está configurado con:
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --prefer-offline --no-audit
        - node scripts/pre-deploy.js
        - node scripts/create-amplify-outputs.js
        - npm run test:ci
        - npm run type-check
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
```

#### Paso 4: Variables de Entorno

Configurar en Amplify Console → App settings → Environment variables:

**Variables Requeridas:**
```
NODE_ENV=production
AMPLIFY_DIFF_DEPLOY=false
NEXT_TELEMETRY_DISABLED=1
CI=true
```

**Variables Opcionales:**
```
AMPLIFY_MONOREPO_APP_ROOT=(vacío)
_LIVE_UPDATES=[{"name":"Amplify CLI","pkg":"@aws-amplify/cli","type":"npm","version":"latest"}]
```

#### Paso 5: Configuración Avanzada

**Build settings:**
- Node.js version: 18
- Build timeout: 30 minutos
- Compute type: Medium
- Live package updates: Habilitado

**Custom headers:** (ya configurados en amplify.yml)
- Security headers
- Cache headers
- CORS headers

#### Paso 6: Iniciar Despliegue

1. Clic en "Save and deploy"
2. Monitorear el progreso en tiempo real
3. El proceso toma 10-20 minutos

### Fases del Despliegue

| Fase | Duración | Descripción |
|------|----------|-------------|
| **Provision** | 1-2 min | Preparar entorno de build |
| **Build** | 5-15 min | Ejecutar amplify.yml |
| **Deploy** | 1-3 min | Subir archivos a CDN |
| **Verify** | 1 min | Verificar despliegue |

## Configuración Post-Despliegue

### 1. Dominio Personalizado (Opcional)

```bash
# En Amplify Console → Domain management
1. Add domain
2. Configurar DNS records
3. Esperar verificación SSL (hasta 24h)
```

### 2. Configuración de Seguridad

- **HTTPS**: Habilitado automáticamente
- **Security headers**: Configurados en amplify.yml
- **Access control**: Configurar si es necesario

### 3. Monitoreo y Alertas

```bash
# Configurar en CloudWatch
1. Métricas de aplicación
2. Logs de build
3. Alertas de error
4. Dashboards personalizados
```

## Verificación

### Checklist Post-Despliegue

#### ✅ Funcionalidad Básica
- [ ] Aplicación carga sin errores
- [ ] Todas las páginas son accesibles
- [ ] Navegación funciona correctamente
- [ ] Formularios se envían correctamente

#### ✅ Responsive Design
- [ ] Funciona en móvil (iOS/Android)
- [ ] Funciona en tablet
- [ ] Funciona en desktop
- [ ] Orientación portrait/landscape

#### ✅ Performance
- [ ] Tiempo de carga < 3 segundos
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals en verde
- [ ] Imágenes optimizadas

#### ✅ SEO y Accesibilidad
- [ ] Meta tags correctos
- [ ] Estructura semántica
- [ ] Alt text en imágenes
- [ ] Contraste de colores adecuado

### Scripts de Verificación

```bash
# Verificar build local
npm run build
npm run validate-build

# Verificar tipos
npm run type-check

# Ejecutar tests
npm run test:ci

# Verificar linting
npm run lint
```

## Troubleshooting

### Errores Comunes

#### Build Failures

**Error: "Module not found"**
```bash
# Solución
npm install
npm run build
```

**Error: "TypeScript errors"**
```bash
# Solución
npm run type-check
# Corregir errores mostrados
```

**Error: "Test failures"**
```bash
# Solución
npm run test
# Corregir tests fallidos
```

#### Runtime Errors

**Error: "amplify_outputs.json not found"**
```bash
# Solución
node scripts/create-amplify-outputs.js
```

**Error: "Environment variables missing"**
- Verificar variables en Amplify Console
- Verificar sintaxis de variables

#### Performance Issues

**Build timeout**
- Aumentar timeout en Amplify Console
- Optimizar dependencias
- Usar compute type más grande

**Slow loading**
- Verificar optimización de imágenes
- Revisar bundle size
- Configurar cache headers

### Logs y Debugging

```bash
# Ver logs de build en Amplify Console
1. App → Build history
2. Seleccionar build fallido
3. Ver logs detallados por fase

# Logs locales
npm run build 2>&1 | tee build.log
```

## Mantenimiento

### Despliegues Futuros

```bash
# Proceso simplificado para updates
1. npm run pre-deploy
2. git add .
3. git commit -m "feat: nueva funcionalidad"
4. git push origin main
# Amplify despliega automáticamente
```

### Monitoreo Continuo

#### Métricas Clave
- **Uptime**: > 99.9%
- **Response time**: < 2s
- **Error rate**: < 1%
- **Build success rate**: > 95%

#### Alertas Recomendadas
- Build failures
- High error rates
- Performance degradation
- Security issues

### Backups y Recuperación

```bash
# Backup de configuración
1. Exportar variables de entorno
2. Backup de amplify.yml
3. Documentar configuraciones custom

# Recuperación ante desastres
1. Recrear app en Amplify
2. Restaurar configuraciones
3. Redesplegar desde Git
```

### Actualizaciones de Dependencias

```bash
# Actualización mensual recomendada
npm audit
npm update
npm run test:ci
npm run pre-deploy
```

### Optimización Continua

#### Performance
- Revisar bundle analyzer mensualmente
- Optimizar imágenes regularmente
- Monitorear Core Web Vitals

#### Seguridad
- Actualizar dependencias vulnerables
- Revisar security headers
- Auditar permisos AWS

#### Costos
- Monitorear uso de Amplify
- Optimizar compute type según uso
- Revisar transfer costs

## Recursos Adicionales

### Documentación Oficial
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Amplify Console Guide](https://docs.aws.amazon.com/amplify/latest/userguide/)

### Herramientas Útiles
- [Amplify CLI](https://docs.amplify.aws/cli/)
- [AWS CloudWatch](https://aws.amazon.com/cloudwatch/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Soporte
- AWS Support (según plan)
- Amplify Community Forums
- GitHub Issues del proyecto

---

**Última actualización:** $(date)  
**Versión:** 1.0.0  
**Mantenido por:** Equipo de Desarrollo