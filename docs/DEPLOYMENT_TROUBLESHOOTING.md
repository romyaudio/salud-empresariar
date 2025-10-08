# Troubleshooting de Despliegue - Budget Tracker

## 🚨 Guía de Resolución de Problemas

### Índice
1. [Errores de Build](#errores-de-build)
2. [Errores de Runtime](#errores-de-runtime)
3. [Problemas de Performance](#problemas-de-performance)
4. [Problemas de Configuración](#problemas-de-configuración)
5. [Problemas de Red](#problemas-de-red)
6. [Herramientas de Diagnóstico](#herramientas-de-diagnóstico)

---

## 🔧 Errores de Build

### Error: "npm install failed"

**Síntomas:**
```
npm ERR! code ENOTFOUND
npm ERR! errno ENOTFOUND
npm ERR! network request failed
```

**Causas Posibles:**
- Problemas de conectividad de red
- Registry de npm no disponible
- Dependencias con versiones incompatibles

**Soluciones:**
```bash
# 1. Limpiar cache de npm
npm cache clean --force

# 2. Verificar .npmrc
echo "registry=https://registry.npmjs.org/" > .npmrc

# 3. Usar npm ci en lugar de npm install
npm ci --prefer-offline --no-audit

# 4. Verificar package-lock.json
git status package-lock.json
```

### Error: "TypeScript compilation failed"

**Síntomas:**
```
Type error: Cannot find module '@/types' or its corresponding type declarations
```

**Causas Posibles:**
- Paths de TypeScript mal configurados
- Archivos de tipos faltantes
- Versión de TypeScript incompatible

**Soluciones:**
```bash
# 1. Verificar tsconfig.json
cat tsconfig.json | grep -A 5 "paths"

# 2. Regenerar tipos
npm run type-check

# 3. Verificar imports
grep -r "@/" src/ --include="*.ts" --include="*.tsx"

# 4. Limpiar cache de TypeScript
rm -rf .next/cache
```

### Error: "Jest tests failed"

**Síntomas:**
```
FAIL src/components/Dashboard.test.tsx
Test suite failed to run
```

**Causas Posibles:**
- Tests desactualizados
- Mocks faltantes
- Dependencias de test no instaladas

**Soluciones:**
```bash
# 1. Ejecutar tests localmente
npm run test -- --verbose

# 2. Verificar configuración de Jest
cat jest.config.js

# 3. Actualizar snapshots si es necesario
npm run test -- --updateSnapshot

# 4. Verificar mocks
ls -la src/**/__mocks__/
```

### Error: "Next.js build failed"

**Síntomas:**
```
Error: Build optimization failed
Error occurred prerendering page "/dashboard"
```

**Causas Posibles:**
- Errores en componentes de React
- Dependencias del lado del cliente en SSR
- Rutas dinámicas mal configuradas

**Soluciones:**
```bash
# 1. Build local para debugging
npm run build 2>&1 | tee build.log

# 2. Verificar componentes problemáticos
grep -r "useEffect\|useState" src/pages/

# 3. Verificar dynamic imports
grep -r "dynamic\|import(" src/

# 4. Revisar next.config.js
cat next.config.js
```

---

## 🚀 Errores de Runtime

### Error: "amplify_outputs.json not found"

**Síntomas:**
```
Error: Cannot resolve module 'amplify_outputs.json'
```

**Causas Posibles:**
- Script de generación no ejecutado
- Archivo no incluido en build
- Variables de entorno faltantes

**Soluciones:**
```bash
# 1. Generar archivo manualmente
node scripts/create-amplify-outputs.js

# 2. Verificar que existe
ls -la amplify_outputs.json

# 3. Verificar contenido
cat amplify_outputs.json | jq .

# 4. Verificar en .gitignore
grep amplify_outputs .gitignore
```

### Error: "Environment variables undefined"

**Síntomas:**
```
ReferenceError: process.env.NEXT_PUBLIC_API_URL is undefined
```

**Causas Posibles:**
- Variables no configuradas en Amplify Console
- Prefijo NEXT_PUBLIC_ faltante
- Variables mal nombradas

**Soluciones:**
```bash
# 1. Verificar variables en Amplify Console
# App settings → Environment variables

# 2. Verificar prefijos
grep -r "process.env" src/ | grep -v "NEXT_PUBLIC"

# 3. Verificar en build logs
# Buscar "Environment variables" en logs de Amplify

# 4. Verificar next.config.js
cat next.config.js | grep -A 10 "env"
```

### Error: "Hydration mismatch"

**Síntomas:**
```
Warning: Text content did not match. Server: "..." Client: "..."
```

**Causas Posibles:**
- Diferencias entre SSR y cliente
- Fechas/timestamps dinámicos
- Contenido dependiente del navegador

**Soluciones:**
```bash
# 1. Identificar componente problemático
# Revisar console del navegador

# 2. Usar useEffect para contenido dinámico
# Mover lógica dependiente del cliente a useEffect

# 3. Verificar suppressHydrationWarning
grep -r "suppressHydrationWarning" src/

# 4. Usar dynamic imports con ssr: false
grep -r "ssr.*false" src/
```

---

## ⚡ Problemas de Performance

### Build muy lento (> 15 minutos)

**Síntomas:**
- Build timeout en Amplify
- Fase de build toma más de 15 minutos

**Causas Posibles:**
- Dependencias pesadas
- Compute type insuficiente
- Cache no configurado

**Soluciones:**
```bash
# 1. Analizar bundle size
npm run build
npx @next/bundle-analyzer

# 2. Verificar dependencias
npm ls --depth=0 | wc -l
npm audit

# 3. Optimizar imports
grep -r "import.*from.*'.*'" src/ | grep -v "@/"

# 4. Configurar cache en amplify.yml
# Verificar sección cache en amplify.yml
```

### Aplicación carga lentamente

**Síntomas:**
- First Contentful Paint > 3s
- Lighthouse Performance < 70

**Causas Posibles:**
- Bundle JavaScript muy grande
- Imágenes no optimizadas
- Recursos no comprimidos

**Soluciones:**
```bash
# 1. Analizar con Lighthouse
npx lighthouse https://tu-app.amplifyapp.com

# 2. Verificar optimización de imágenes
find src/ -name "*.jpg" -o -name "*.png" | xargs ls -lh

# 3. Verificar code splitting
grep -r "dynamic\|lazy" src/

# 4. Verificar headers de cache
curl -I https://tu-app.amplifyapp.com
```

---

## ⚙️ Problemas de Configuración

### Dominio personalizado no funciona

**Síntomas:**
- SSL certificate error
- DNS resolution failed
- Domain not accessible

**Causas Posibles:**
- DNS records mal configurados
- SSL certificate no validado
- Propagación DNS pendiente

**Soluciones:**
```bash
# 1. Verificar DNS records
nslookup tu-dominio.com
dig tu-dominio.com

# 2. Verificar SSL certificate
openssl s_client -connect tu-dominio.com:443

# 3. Verificar en Amplify Console
# Domain management → Ver status

# 4. Esperar propagación (hasta 48h)
```

### Redirects no funcionan

**Síntomas:**
- 404 en rutas específicas
- Redirects no aplicados
- SPA routing no funciona

**Causas Posibles:**
- Configuración de redirects faltante
- Orden de redirects incorrecto
- Conflicto con Next.js routing

**Soluciones:**
```bash
# 1. Verificar amplify.yml redirects
cat amplify.yml | grep -A 10 "redirects"

# 2. Verificar next.config.js redirects
cat next.config.js | grep -A 10 "redirects"

# 3. Probar redirects manualmente
curl -I https://tu-app.amplifyapp.com/old-path

# 4. Verificar en Amplify Console
# App settings → Rewrites and redirects
```

---

## 🌐 Problemas de Red

### CORS errors

**Síntomas:**
```
Access to fetch at 'api.example.com' from origin 'app.amplifyapp.com' 
has been blocked by CORS policy
```

**Causas Posibles:**
- API no configurada para CORS
- Headers CORS incorrectos
- Preflight requests fallando

**Soluciones:**
```bash
# 1. Verificar headers CORS
curl -H "Origin: https://tu-app.amplifyapp.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://api.example.com

# 2. Configurar en API backend
# Agregar headers CORS apropiados

# 3. Verificar en Network tab
# Revisar preflight OPTIONS requests

# 4. Usar proxy en next.config.js si es necesario
```

### API calls failing

**Síntomas:**
- Network errors en requests
- Timeout errors
- 500 Internal Server Error

**Causas Posibles:**
- API endpoint incorrecto
- Authentication headers faltantes
- Rate limiting

**Soluciones:**
```bash
# 1. Verificar endpoints
curl -v https://api.example.com/health

# 2. Verificar authentication
# Revisar tokens y headers

# 3. Verificar rate limits
# Revisar headers de response

# 4. Verificar logs de API
# Revisar CloudWatch logs
```

---

## 🔍 Herramientas de Diagnóstico

### Logs de Amplify

```bash
# 1. Acceder a logs en Amplify Console
# App → Build history → Select build → View logs

# 2. Filtrar logs por fase
# Provision, Build, Deploy, Verify

# 3. Buscar errores específicos
# Ctrl+F para buscar "ERROR", "FAIL", "Exception"
```

### Debugging Local

```bash
# 1. Reproducir build localmente
npm run pre-deploy

# 2. Verificar variables de entorno
printenv | grep NEXT_

# 3. Verificar archivos generados
ls -la .next/
ls -la amplify_outputs.json

# 4. Probar en modo producción
npm run build && npm start
```

### Herramientas de Monitoreo

```bash
# 1. Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage

# 2. Bundle analyzer
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# 3. Performance monitoring
# Configurar en Amplify Console → Monitoring

# 4. Error tracking
# Configurar Sentry o similar
```

### Scripts de Diagnóstico

```bash
# 1. Health check completo
node scripts/health-check.js

# 2. Verificar configuración
node scripts/verify-config.js

# 3. Test de conectividad
node scripts/test-connectivity.js

# 4. Validar build
npm run validate-build
```

---

## 📞 Escalación y Soporte

### Cuándo Escalar

- Build failures persistentes (> 3 intentos)
- Problemas de infraestructura AWS
- Errores de configuración complejos
- Problemas de performance críticos

### Información para Soporte

```bash
# 1. Información del build
Build ID: _______________
Timestamp: _______________
Branch: _______________
Commit: _______________

# 2. Logs relevantes
# Copiar logs de error específicos

# 3. Configuración
# Exportar variables de entorno (sin secretos)
# Copiar amplify.yml relevante

# 4. Pasos para reproducir
# Documentar pasos exactos
```

### Contactos de Soporte

- **AWS Support:** Según plan de soporte
- **Amplify Community:** GitHub Discussions
- **Equipo interno:** [Contacto interno]
- **Documentación:** https://docs.amplify.aws/

---

**Última actualización:** $(date)  
**Versión:** 1.0.0  
**Mantenido por:** Equipo de DevOps