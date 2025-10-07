# Instrucciones de Configuración - Budget Tracker

## 🚀 Configuración Inicial

### 1. Clonar el Repositorio
```bash
git clone https://github.com/romyaudio/salud-empresariar.git
cd salud-empresariar
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Archivos Sensibles

⚠️ **IMPORTANTE:** Este proyecto requiere configuración de archivos sensibles que no están en Git por seguridad.

#### Opción A: Configuración Automática (Recomendada)
```bash
npm run setup:outputs
```
Sigue las instrucciones y proporciona:
- User Pool ID de AWS Cognito
- User Pool Client ID
- GraphQL Endpoint de AWS AppSync
- Región de AWS (default: us-east-1)

#### Opción B: Configuración Manual
1. Copiar archivo de ejemplo:
   ```bash
   cp amplify_outputs.example.json amplify_outputs.json
   ```

2. Editar `amplify_outputs.json` y reemplazar:
   - `us-east-1_XXXXXXXXX` → Tu User Pool ID real
   - `xxxxxxxxxxxxxxxxxxxxxxxxxx` → Tu Client ID real
   - `https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql` → Tu GraphQL endpoint real

### 4. Verificar Configuración
```bash
# Verificar conectividad con AWS
npm run verify:cognito

# Verificar configuración general
npm run test:aws

# Debug de autenticación
npm run debug:auth
```

### 5. Iniciar la Aplicación
```bash
npm run dev
```

Abrir: http://localhost:3000

## 🧪 Credenciales de Prueba

Si tienes acceso a AWS CLI configurado, puedes crear un usuario de prueba:

```bash
npm run create:user
```

Esto creará:
- **Email:** test@empresa.com
- **Contraseña:** TempPass123!

## 🔒 Seguridad

### Archivos Sensibles (NO subir a Git)
- `amplify_outputs.json` - Credenciales de AWS
- `.env.local` - Variables de entorno locales

### Archivos Seguros (OK para Git)
- `amplify_outputs.example.json` - Plantilla sin credenciales
- `.env.example` - Ejemplo de variables de entorno

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm run start            # Iniciar servidor de producción

# Configuración
npm run setup:outputs    # Configurar amplify_outputs.json
npm run setup:amplify    # Configurar AWS Amplify

# Verificación
npm run test:aws         # Verificar configuración AWS
npm run verify:cognito   # Verificar conectividad Cognito
npm run debug:auth       # Debug de autenticación

# Usuarios
npm run create:user      # Crear usuario de prueba

# Testing
npm run test             # Ejecutar tests
npm run lint             # Verificar código
```

## 🏗️ Arquitectura

- **Frontend:** Next.js 14 con TypeScript
- **Autenticación:** AWS Cognito
- **Base de datos:** AWS DynamoDB
- **API:** AWS AppSync (GraphQL)
- **Hosting:** AWS Amplify

## 📚 Documentación

- [`docs/SECURITY.md`](docs/SECURITY.md) - Guía de seguridad
- [`docs/DATABASE_SETUP.md`](docs/DATABASE_SETUP.md) - Configuración de base de datos
- [`docs/TESTING_GUIDE.md`](docs/TESTING_GUIDE.md) - Guía de pruebas
- [`docs/AWS_AMPLIFY_MANUAL_SETUP.md`](docs/AWS_AMPLIFY_MANUAL_SETUP.md) - Configuración manual de AWS

## 🐛 Solución de Problemas

### Error: "amplify_outputs.json not found"
```bash
npm run setup:outputs
```

### Error: "Error al iniciar sesión"
1. Verificar configuración:
   ```bash
   npm run debug:auth
   ```
2. Verificar conectividad:
   ```bash
   npm run verify:cognito
   ```

### Error: "User pool does not exist"
- Verificar que el User Pool ID sea correcto
- Verificar que AWS CLI esté configurado con la cuenta correcta

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama para feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

⚠️ **NUNCA incluyas archivos con credenciales reales en tus commits**

## 📞 Soporte

Si tienes problemas:

1. Revisar documentación en `docs/`
2. Ejecutar scripts de diagnóstico
3. Verificar configuración de AWS
4. Crear issue en GitHub

---

## ✅ Checklist de Configuración

- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] `amplify_outputs.json` configurado
- [ ] Conectividad AWS verificada (`npm run verify:cognito`)
- [ ] Aplicación iniciada (`npm run dev`)
- [ ] Usuario de prueba creado (opcional)
- [ ] Autenticación funcionando

¡Tu aplicación de presupuesto está lista para usar! 🎉