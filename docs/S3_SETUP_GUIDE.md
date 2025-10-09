# Guía de Configuración de AWS S3 para Budget Tracker

Esta guía te ayudará a configurar AWS S3 con Amplify para almacenar imágenes de perfil y logos de empresa de forma segura.

## 📋 Requisitos Previos

- ✅ Proyecto Amplify ya configurado
- ✅ AWS CLI instalado y configurado
- ✅ Cuenta de AWS activa
- ✅ Permisos de administrador en AWS

## 🚀 Paso 1: Agregar Storage a Amplify

### 1.1 Instalar dependencias necesarias

```bash
npm install aws-amplify @aws-amplify/storage
```

### 1.2 Agregar Storage al proyecto Amplify

```bash
amplify add storage
```

Responde las preguntas de configuración:

```
? Select from one of the below mentioned services: Content (Images, audio, video, etc.)
? Provide a friendly name for your resource: budgetTrackerStorage
? Provide bucket name: budget-tracker-storage-[tu-nombre-unico]
? Who should have access: Auth users only
? What kind of access do you want for Authenticated users?
  ◉ create/update
  ◉ read
  ◉ delete
? Do you want to add a Lambda Trigger for your S3 Bucket? No
```

### 1.3 Desplegar la configuración

```bash
amplify push
```

## 🔧 Paso 2: Configurar el Storage en el Código

### 2.1 Actualizar amplify/backend.ts

```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

export const backend = defineBackend({
  auth,
  data,
  storage,
});
```

### 2.2 Crear amplify/storage/resource.ts

```typescript
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'budgetTrackerStorage',
  access: (allow) => ({
    'profile-images/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'company-logos/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'public/*': [
      allow.authenticated.to(['read']),
      allow.guest.to(['read'])
    ]
  })
});
```

## 📱 Paso 3: Implementar Upload de Imágenes

### 3.1 Crear servicio de Storage

Crea `src/lib/services/storageService.ts`:

```typescript
import { uploadData, getUrl, remove } from 'aws-amplify/storage';

export class StorageService {
  // Subir imagen de perfil
  static async uploadProfileImage(file: File, userId: string): Promise<string> {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile-images/${userId}/avatar.${fileExtension}`;
      
      const result = await uploadData({
        key: fileName,
        data: file,
        options: {
          contentType: file.type,
          metadata: {
            userId: userId,
            uploadedAt: new Date().toISOString()
          }
        }
      }).result;

      // Obtener URL pública
      const urlResult = await getUrl({
        key: result.key,
        options: {
          expiresIn: 3600 // 1 hora
        }
      });

      return urlResult.url.toString();
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new Error('Error al subir la imagen de perfil');
    }
  }

  // Subir logo de empresa
  static async uploadCompanyLogo(file: File, userId: string): Promise<string> {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `company-logos/${userId}/logo.${fileExtension}`;
      
      const result = await uploadData({
        key: fileName,
        data: file,
        options: {
          contentType: file.type,
          metadata: {
            userId: userId,
            uploadedAt: new Date().toISOString()
          }
        }
      }).result;

      // Obtener URL pública
      const urlResult = await getUrl({
        key: result.key,
        options: {
          expiresIn: 3600 // 1 hora
        }
      });

      return urlResult.url.toString();
    } catch (error) {
      console.error('Error uploading company logo:', error);
      throw new Error('Error al subir el logo de la empresa');
    }
  }

  // Eliminar imagen
  static async deleteImage(key: string): Promise<void> {
    try {
      await remove({ key });
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }

  // Validar archivo de imagen
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de archivo no permitido. Solo se permiten JPG, PNG y WebP.'
      };
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'El archivo es muy grande. Máximo 5MB permitido.'
      };
    }

    return { isValid: true };
  }

  // Redimensionar imagen (opcional)
  static async resizeImage(file: File, maxWidth: number = 400): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          }
        }, file.type, 0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}
```

### 3.2 Actualizar useProfile.ts

```typescript
import { StorageService } from '@/lib/services/storageService';

// En las funciones de upload:
const uploadProfileImage = async (file: File): Promise<string> => {
  if (!user) throw new Error('Usuario no autenticado');

  try {
    setError(null);

    // Validar archivo
    const validation = StorageService.validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Redimensionar imagen
    const resizedFile = await StorageService.resizeImage(file, 400);

    // Subir a S3
    const imageUrl = await StorageService.uploadProfileImage(resizedFile, user.id);

    // Actualizar perfil
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        profileImage: imageUrl,
        updatedAt: new Date().toISOString()
      };
      
      setUserProfile(updatedProfile);
      saveToStorage(`${USER_PROFILE_KEY}_${user.id}`, updatedProfile);
    }

    return imageUrl;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    throw err;
  }
};
```

## 🔒 Paso 4: Configurar Permisos de Seguridad

### 4.1 Política de Bucket S3

El bucket debe tener esta política de acceso:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAuthenticatedUsers",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-ID:role/amplify-*"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::bucket-name/profile-images/*"
    }
  ]
}
```

### 4.2 Configurar CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## 🧪 Paso 5: Testing

### 5.1 Crear test para StorageService

```typescript
// src/lib/services/__tests__/storageService.test.ts
import { StorageService } from '../storageService';

describe('StorageService', () => {
  test('validates image file correctly', () => {
    const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = StorageService.validateImageFile(validFile);
    expect(result.isValid).toBe(true);
  });

  test('rejects invalid file type', () => {
    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
    const result = StorageService.validateImageFile(invalidFile);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Tipo de archivo no permitido');
  });
});
```

## 📊 Paso 6: Monitoreo y Optimización

### 6.1 Configurar CloudWatch

- Monitorea el uso de almacenamiento
- Configura alertas para costos
- Revisa logs de acceso

### 6.2 Optimización de Costos

```typescript
// Configurar lifecycle policies
const lifecyclePolicy = {
  Rules: [
    {
      Status: 'Enabled',
      Transitions: [
        {
          Days: 30,
          StorageClass: 'STANDARD_IA'
        },
        {
          Days: 90,
          StorageClass: 'GLACIER'
        }
      ]
    }
  ]
};
```

## 🚨 Troubleshooting

### Errores Comunes

1. **Access Denied**
   - Verificar permisos IAM
   - Revisar política del bucket
   - Confirmar autenticación del usuario

2. **CORS Error**
   - Configurar CORS en el bucket
   - Verificar dominios permitidos

3. **File Too Large**
   - Implementar compresión de imágenes
   - Configurar límites en el frontend

### Comandos Útiles

```bash
# Ver configuración actual
amplify status

# Actualizar storage
amplify update storage

# Ver logs
amplify console

# Eliminar storage (¡CUIDADO!)
amplify remove storage
```

## 📝 Checklist Final

- [ ] Storage configurado en Amplify
- [ ] Permisos IAM correctos
- [ ] CORS configurado
- [ ] StorageService implementado
- [ ] Validación de archivos
- [ ] Redimensionamiento de imágenes
- [ ] Tests implementados
- [ ] Monitoreo configurado

## 💰 Estimación de Costos

Para una aplicación pequeña-mediana:
- **Almacenamiento**: ~$0.023/GB/mes
- **Requests**: ~$0.0004/1000 requests
- **Transfer**: ~$0.09/GB

**Estimación mensual**: $5-20 USD para 1000 usuarios activos

---

¡Con esta configuración tendrás un sistema robusto y seguro para manejar imágenes en tu Budget Tracker! 🎉