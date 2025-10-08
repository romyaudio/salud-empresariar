# Workflow de Deploy - Budget Tracker

## Resumen

Este documento describe el workflow recomendado para hacer deploy de la aplicación Budget Tracker en AWS Amplify Console, incluyendo verificaciones locales antes del push a git.

## Workflow Recomendado

### 1. Verificaciones Locales (OBLIGATORIO)

Antes de hacer cualquier push a git, **SIEMPRE** ejecuta las verificaciones locales:

```bash
npm run pre-deploy
```

Este comando ejecuta automáticamente:
- ✅ Verificación de archivos críticos
- ✅ Limpieza de cache de npm
- ✅ Instalación de dependencias
- ✅ Verificación de tipos TypeScript
- ✅ Ejecución de tests
- ✅ Generación de amplify_outputs.json
- ✅ Build de producción
- ✅ Verificación de archivos de build

### 2. Push a Git (Solo si las verificaciones pasan)

```bash
git add .
git commit -m "feat: Ready for deploy"
git push origin master
```

### 3. Monitoreo del Deploy en Amplify Console

1. Ve a AWS Amplify Console
2. Selecciona tu aplicación
3. Monitorea el progreso del build
4. Verifica que no haya errores en los logs

## Archivos Críticos para Deploy

### .npmrc
```
legacy-peer-deps=true
prefer-offline=true
audit=false
fund=false
```

### amplify.yml (Optimizado)
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Installing dependencies..."
        - npm ci --prefer-offline --no-audit --omit=optional
        - echo "Creating amplify_outputs.json..."
        - node scripts/create-amplify-outputs.js
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

## Resolución de Problemas Comunes

### Error: Dependencias de TensorFlow

**Problema:** Warnings sobre @tensorflow/tfjs-core y peer dependencies

**Solución:**
1. Verificar que `.npmrc` existe con `legacy-peer-deps=true`
2. Usar `npm ci --omit=optional` en lugar de `npm install`
3. Ejecutar `npm run pre-deploy` localmente antes del push

### Error: amplify_outputs.json faltante

**Problema:** Build falla porque no encuentra amplify_outputs.json

**Solución:**
1. Verificar que `scripts/create-amplify-outputs.js` existe
2. Verificar variables de entorno en Amplify Console
3. El script se ejecuta automáticamente en preBuild

### Error: Build local vs Amplify Console diferente

**Problema:** Build funciona localmente pero falla en Amplify

**Solución:**
1. **SIEMPRE** ejecutar `npm run pre-deploy` antes del push
2. Verificar que todas las dependencias están en package.json
3. No usar dependencias globales o del sistema

## Variables de Entorno Requeridas

En Amplify Console, configurar:

```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
```

## Comandos Útiles

### Verificación Completa Local
```bash
npm run pre-deploy
```

### Build Solo
```bash
npm run build
```

### Verificación de Tipos
```bash
npm run type-check
```

### Tests
```bash
npm test
```

### Generar amplify_outputs.json
```bash
npm run create:outputs
```

## Checklist Pre-Deploy

- [ ] ✅ Ejecutar `npm run pre-deploy` exitosamente
- [ ] ✅ Verificar que no hay errores de TypeScript
- [ ] ✅ Verificar que todos los tests pasan
- [ ] ✅ Verificar que el build local funciona
- [ ] ✅ Verificar que amplify_outputs.json se genera correctamente
- [ ] ✅ Commit con mensaje descriptivo
- [ ] ✅ Push a master branch
- [ ] ✅ Monitorear deploy en Amplify Console

## Notas Importantes

1. **Nunca hacer push sin verificaciones locales**
2. **El archivo .npmrc es crítico para resolver dependencias**
3. **amplify_outputs.json se genera automáticamente, no commitear manualmente**
4. **Usar npm ci en lugar de npm install en producción**
5. **Monitorear siempre los logs de Amplify Console después del push**

## Contacto y Soporte

Si encuentras problemas con el deploy:
1. Revisar logs de Amplify Console
2. Ejecutar `npm run pre-deploy` localmente
3. Verificar variables de entorno en Amplify Console
4. Consultar este documento para troubleshooting