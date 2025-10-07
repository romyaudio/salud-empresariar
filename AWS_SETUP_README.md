# 🚀 Configuración de AWS Amplify - Budget Tracker

## Resumen Rápido

Esta guía te ayudará a configurar AWS Amplify manualmente desde la consola para que tu aplicación Budget Tracker funcione en producción con datos reales.

## 📋 Checklist de Configuración

### Antes de Empezar
- [ ] Cuenta de AWS activa
- [ ] Acceso a AWS Console
- [ ] Repositorio en GitHub actualizado

### Paso 1: Amazon Cognito (Autenticación)
- [ ] Crear User Pool
- [ ] Configurar App Client
- [ ] Anotar User Pool ID y Client ID

### Paso 2: AWS AppSync (GraphQL API)
- [ ] Crear API GraphQL
- [ ] Configurar Schema
- [ ] Anotar GraphQL Endpoint

### Paso 3: Configuración Local
- [ ] Crear archivo `.env.local`
- [ ] Verificar configuración con `npm run verify:aws`
- [ ] Probar build local con `npm run build`

### Paso 4: AWS Amplify Hosting
- [ ] Conectar repositorio GitHub
- [ ] Configurar variables de entorno
- [ ] Desplegar aplicación

## 🎯 Comandos Rápidos

```bash
# Verificar configuración actual
npm run verify:aws

# Probar build local
npm run build

# Preparar para despliegue
npm run deploy:prepare
```

## 📚 Documentación Detallada

1. **[Guía Completa de Configuración](docs/AWS_AMPLIFY_MANUAL_SETUP.md)**
   - Paso a paso detallado
   - Screenshots y ejemplos
   - Configuraciones recomendadas

2. **[Valores de Configuración](docs/CONFIGURATION_VALUES.md)**
   - Qué valores necesitas recopilar
   - Formato de variables de entorno
   - Ejemplos de configuración

3. **[Integración GraphQL](docs/GRAPHQL_INTEGRATION.md)**
   - Cómo funciona la integración
   - Troubleshooting
   - Operaciones disponibles

## ⚡ Configuración Rápida (15 minutos)

### 1. Crear User Pool en Cognito
```
1. Ir a: https://console.aws.amazon.com/cognito/
2. Create user pool → Email → Configurar según guía
3. Anotar: User Pool ID (us-east-1_XXXXXXXXX)
```

### 2. Crear App Client
```
1. En el User Pool → App integration → Create app client
2. Configurar URLs de callback
3. Anotar: Client ID (xxxxxxxxxxxxxxxxxxxxxxxxxx)
```

### 3. Crear API GraphQL
```
1. Ir a: https://console.aws.amazon.com/appsync/
2. Create API → Build from scratch
3. Copiar schema desde docs/
4. Anotar: GraphQL Endpoint
```

### 4. Configurar Variables
```bash
# Crear .env.local
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=us-east-1_TU_ID
NEXT_PUBLIC_USER_POOL_CLIENT_ID=TU_CLIENT_ID
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://TU_ENDPOINT.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_DEMO_MODE=false
```

### 5. Verificar y Desplegar
```bash
npm run verify:aws  # Verificar configuración
npm run build       # Probar build
git push origin master  # Subir cambios
```

## 🔧 Troubleshooting

### Problema: "User Pool not found"
**Solución**: Verificar User Pool ID en `.env.local`

### Problema: "GraphQL endpoint not accessible"
**Solución**: Verificar que el schema esté desplegado en AppSync

### Problema: "Build failed"
**Solución**: Ejecutar `npm run verify:aws` para ver qué falta

### Problema: "Authentication failed"
**Solución**: Verificar URLs de callback en Cognito App Client

## 📞 Soporte

Si tienes problemas:

1. **Ejecutar diagnóstico**: `npm run verify:aws`
2. **Revisar logs**: En AWS Console → CloudWatch
3. **Verificar documentación**: `docs/AWS_AMPLIFY_MANUAL_SETUP.md`

## 🎉 ¡Listo!

Una vez configurado correctamente:
- ✅ La aplicación funcionará con datos reales en AWS
- ✅ Los usuarios podrán registrarse y autenticarse
- ✅ Las transacciones se guardarán en DynamoDB
- ✅ Todo estará sincronizado en la nube

---

**Tiempo estimado**: 15-30 minutos
**Costo**: Gratis (dentro del free tier de AWS)