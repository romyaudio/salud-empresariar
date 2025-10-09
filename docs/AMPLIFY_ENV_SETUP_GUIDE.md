# Guía Paso a Paso: Configurar Variables de Entorno S3 en AWS Amplify

## 🎯 Objetivo
Configurar las variables de entorno de S3 en AWS Amplify Console para que la subida de imágenes funcione en producción.

## 📋 Prerrequisitos
- ✅ Tener acceso a AWS Amplify Console
- ✅ Tu aplicación ya desplegada en Amplify
- ✅ Variables S3 funcionando en local

## 🚀 Pasos Detallados

### Paso 1: Acceder a AWS Amplify Console
1. Ve a: https://console.aws.amazon.com/amplify/
2. Inicia sesión con tu cuenta AWS
3. Busca y selecciona tu aplicación: **salud-empresariar**

### Paso 2: Navegar a Variables de Entorno
1. En el menú lateral izquierdo, busca **"Environment variables"**
2. Haz clic en **"Environment variables"**
3. Verás una página con las variables actuales (si las hay)
4. Haz clic en el botón **"Manage variables"**

### Paso 3: Agregar Variables S3
Agrega las siguientes variables **una por una**:

#### Variables del Servidor (Privadas)
```
Variable Name: AWS_REGION
Value: us-east-1

Variable Name: AWS_S3_BUCKET_NAME
Value: budget-tracker-images-romy

Variable Name: AWS_ACCESS_KEY_ID
Value: [TU_ACCESS_KEY_ID]

Variable Name: AWS_SECRET_ACCESS_KEY
Value: [TU_SECRET_ACCESS_KEY]
```

#### Variables del Cliente (Públicas)
```
Variable Name: NEXT_PUBLIC_AWS_REGION
Value: us-east-1

Variable Name: NEXT_PUBLIC_AWS_S3_BUCKET_NAME
Value: budget-tracker-images-romy

Variable Name: NEXT_PUBLIC_AWS_S3_BUCKET_URL
Value: https://budget-tracker-images-romy.s3.amazonaws.com

Variable Name: NEXT_PUBLIC_AWS_ACCESS_KEY_ID
Value: [TU_ACCESS_KEY_ID]

Variable Name: NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
Value: [TU_SECRET_ACCESS_KEY]
```

### Paso 4: Guardar Variables
1. Después de agregar todas las variables, haz clic en **"Save"**
2. Verás una confirmación de que las variables se guardaron

### Paso 5: Redeploy de la Aplicación
1. Ve a la pestaña **"Deployments"** en el menú lateral
2. Busca el último deployment exitoso
3. Haz clic en **"Redeploy this version"**
4. Espera a que termine el proceso (puede tomar 5-10 minutos)

### Paso 6: Verificar que Funciona
Una vez que termine el deployment:

1. **Verificación Automática:**
   - Ve a: `https://tu-app.amplifyapp.com/api/s3/verify-config`
   - Deberías ver: `"status": "SUCCESS"`

2. **Verificación Manual:**
   - Ve a tu aplicación en producción
   - Inicia sesión
   - Ve al perfil de usuario
   - Intenta subir una imagen de perfil
   - Debería funcionar sin errores

## 🔍 Troubleshooting

### Si las variables no aparecen:
- Asegúrate de hacer clic en "Save" después de agregar cada variable
- Verifica que no haya espacios extra al inicio o final de los valores
- Confirma que los nombres de las variables estén escritos exactamente como se muestra

### Si el deployment falla:
- Revisa los logs en Amplify Console > Deployments > Ver logs
- Busca errores relacionados con variables de entorno
- Asegúrate de que todas las 9 variables estén configuradas

### Si S3 sigue sin funcionar:
1. Verifica el endpoint: `/api/s3/verify-config`
2. Revisa la consola del navegador para errores
3. Confirma que el bucket S3 existe y tiene permisos correctos

## ✅ Resultado Esperado

Después de completar estos pasos:
- ✅ Las imágenes de perfil se subirán a S3
- ✅ Los logos de empresa se subirán a S3
- ✅ Las URLs de las imágenes serán permanentes
- ✅ No habrá más errores de S3 en producción

## 📞 Soporte

Si necesitas ayuda:
1. Revisa los logs de Amplify Console
2. Usa el endpoint `/api/s3/verify-config` para diagnosticar
3. Verifica que el bucket S3 tenga los permisos correctos
4. Confirma que las credenciales AWS sean válidas

## 🔐 Seguridad

**Importante:** Las credenciales mostradas son sensibles. Asegúrate de que:
- El usuario IAM tenga solo permisos mínimos para S3
- Las credenciales no se compartan públicamente
- Consideres usar roles IAM para mayor seguridad en el futuro