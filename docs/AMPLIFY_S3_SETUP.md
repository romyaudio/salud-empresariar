# Configuración de S3 en AWS Amplify

## 🎯 Problema
S3 funciona perfectamente en local pero falla en AWS Amplify porque las variables de entorno no están configuradas en la consola de Amplify.

## ✅ Solución Paso a Paso

### 1. Acceder a AWS Amplify Console
1. Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Inicia sesión con tu cuenta AWS
3. Selecciona tu aplicación: **salud-empresariar**

### 2. Configurar Variables de Entorno
1. En el menú lateral izquierdo, haz clic en **"Environment variables"**
2. Haz clic en el botón **"Manage variables"**
3. Agrega las siguientes variables una por una:

#### Variables del Servidor (Server-side)
```
Variable: AWS_REGION
Value: us-east-1

Variable: AWS_S3_BUCKET_NAME
Value: budget-tracker-images-romy

Variable: AWS_ACCESS_KEY_ID
Value: [TU_ACCESS_KEY_ID]

Variable: AWS_SECRET_ACCESS_KEY
Value: [TU_SECRET_ACCESS_KEY]
```

#### Variables del Cliente (Client-side)
```
Variable: NEXT_PUBLIC_AWS_REGION
Value: us-east-1

Variable: NEXT_PUBLIC_AWS_S3_BUCKET_NAME
Value: budget-tracker-images-romy

Variable: NEXT_PUBLIC_AWS_S3_BUCKET_URL
Value: https://budget-tracker-images-romy.s3.amazonaws.com

Variable: NEXT_PUBLIC_AWS_ACCESS_KEY_ID
Value: [TU_ACCESS_KEY_ID]

Variable: NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
Value: [TU_SECRET_ACCESS_KEY]
```

### 3. Guardar y Redeploy
1. Después de agregar todas las variables, haz clic en **"Save"**
2. Ve a la pestaña **"Deployments"** en el menú lateral
3. Haz clic en **"Redeploy this version"** en el último deployment

### 4. Verificar la Configuración
Una vez que el deployment termine, puedes verificar que las variables estén configuradas correctamente:

1. **Opción 1**: Visita `https://tu-app.amplifyapp.com/api/s3/verify-config`
2. **Opción 2**: Ve al perfil de usuario en tu app y trata de subir una imagen

## 🔍 Verificación de Estado

### Respuesta Exitosa
```json
{
  "status": "SUCCESS",
  "environment": "production",
  "serverComplete": true,
  "clientComplete": true,
  "message": "S3 configuration is complete"
}
```

### Respuesta con Error
```json
{
  "status": "INCOMPLETE",
  "environment": "production",
  "serverComplete": false,
  "clientComplete": false,
  "message": "S3 configuration is incomplete"
}
```

## ⚠️ Notas Importantes

### Seguridad
- Las credenciales AWS mostradas son sensibles
- Asegúrate de que el usuario IAM tenga solo permisos mínimos para S3
- Considera usar roles IAM en lugar de credenciales hardcodeadas para mayor seguridad

### Permisos IAM Necesarios
El usuario AWS debe tener estos permisos mínimos:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::budget-tracker-images-romy/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::budget-tracker-images-romy"
    }
  ]
}
```

### Bucket S3 Policy
El bucket debe tener una policy que permita acceso público de lectura:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::budget-tracker-images-romy/*"
    }
  ]
}
```

## 🚀 Después de la Configuración

Una vez configuradas las variables:
1. ✅ Las imágenes de perfil se subirán a S3
2. ✅ Los logos de empresa se subirán a S3  
3. ✅ Las URLs serán permanentes y accesibles públicamente
4. ✅ No habrá más errores de S3 en producción

## 🔧 Troubleshooting

### Si sigue sin funcionar:
1. Verifica que todas las variables estén escritas exactamente como se muestra
2. Asegúrate de que no haya espacios extra al inicio o final
3. Confirma que el redeploy se completó exitosamente
4. Revisa los logs de Amplify en la consola para errores específicos

### Logs útiles:
- AWS Amplify Console > Tu App > Deployments > Ver logs del último build
- Browser DevTools > Console para errores del cliente
- Browser DevTools > Network para errores de API