# Pasos para Implementar S3 en Budget Tracker

## 🚀 Guía Rápida de Implementación

### Paso 1: Configurar S3 en AWS Console
Sigue la guía completa: `docs/S3_MANUAL_SETUP.md`

### Paso 2: Instalar Dependencias
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Paso 3: Configurar Variables de Entorno
Copia `.env.example` a `.env.local` y completa:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu-access-key-id
AWS_SECRET_ACCESS_KEY=tu-secret-access-key
AWS_S3_BUCKET_NAME=budget-tracker-images-tu-nombre

# Public variables
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=budget-tracker-images-tu-nombre
NEXT_PUBLIC_AWS_S3_BUCKET_URL=https://budget-tracker-images-tu-nombre.s3.amazonaws.com
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=tu-access-key-id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=tu-secret-access-key
```

### Paso 4: Verificar Implementación
Los archivos ya están listos:
- ✅ `src/lib/services/storageService.ts` - Servicio de almacenamiento
- ✅ `src/app/api/s3/presigned-url/route.ts` - API para URLs presignadas
- ✅ `src/app/api/s3/delete/route.ts` - API para eliminar archivos
- ✅ `src/hooks/useProfile.ts` - Hook actualizado para usar S3

### Paso 5: Probar Funcionalidad
1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a `/profile` en tu aplicación

3. Intenta subir una imagen de perfil

4. Verifica que aparezca en tu bucket S3

## 🔄 Cómo Funciona

### Modo Desarrollo (Sin S3)
- Las imágenes se almacenan como URLs locales
- Los datos se guardan en localStorage
- Perfecto para desarrollo y testing

### Modo Producción (Con S3)
- Las imágenes se suben a S3 automáticamente
- Se generan URLs públicas permanentes
- Los datos se pueden integrar con base de datos real

### Detección Automática
El sistema detecta automáticamente si S3 está configurado:

```typescript
// En StorageService.ts
static isS3Configured(): boolean {
  return !!(S3_CONFIG.bucketName && S3_CONFIG.accessKeyId);
}

// Uso automático
static async uploadProfileImage(file: File, userId: string): Promise<string> {
  if (this.isS3Configured()) {
    return this.uploadToS3(file, 'profile-images', userId);
  } else {
    return this.uploadProfileImageLocal(file, userId);
  }
}
```

## 🛡️ Seguridad

### Variables de Entorno
- Las credenciales AWS están en variables de entorno
- No se exponen en el código frontend
- Se usan URLs presignadas para uploads seguros

### Permisos S3
- Solo usuarios autenticados pueden subir
- Las imágenes son públicas para lectura
- Estructura de carpetas organizada por usuario

## 📊 Monitoreo

### Verificar Uploads
1. Ve a AWS S3 Console
2. Abre tu bucket
3. Verifica que las imágenes aparezcan en:
   - `profile-images/`
   - `company-logos/`

### Logs de Errores
Revisa la consola del navegador para errores de upload.

## 🚨 Troubleshooting

### Error: "S3 no está configurado"
- Verifica las variables de entorno en `.env.local`
- Reinicia el servidor de desarrollo

### Error: "Access Denied"
- Revisa la bucket policy en S3
- Confirma que las credenciales IAM sean correctas

### Error: "CORS"
- Verifica la configuración CORS en S3
- Asegúrate de permitir tu dominio

## ✅ Checklist de Verificación

- [ ] Bucket S3 creado y configurado
- [ ] Usuario IAM con permisos correctos
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- [ ] Servidor reiniciado
- [ ] Upload de imagen funciona
- [ ] Imagen aparece en S3
- [ ] Imagen se muestra en la aplicación

---

¡Una vez completados estos pasos, tendrás un sistema completo de almacenamiento de imágenes! 🎉