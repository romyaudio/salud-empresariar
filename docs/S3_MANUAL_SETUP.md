# Configuración Manual de S3 en AWS Console

Esta guía te llevará paso a paso para configurar S3 manualmente desde la consola de AWS para almacenar imágenes del Budget Tracker.

## 🎯 Objetivo

Crear un bucket S3 seguro para almacenar:
- Fotos de perfil de usuarios
- Logos de empresas
- Con acceso controlado y URLs públicas

## 📋 Paso 1: Crear el Bucket S3

### 1.1 Acceder a la Consola de AWS
1. Ve a [AWS Console](https://console.aws.amazon.com/)
2. Inicia sesión con tu cuenta
3. Busca "S3" en el buscador de servicios
4. Haz clic en "S3"

### 1.2 Crear Nuevo Bucket
1. Haz clic en **"Create bucket"**
2. Configura los siguientes campos:

**Configuración General:**
```
Bucket name: budget-tracker-images-[tu-nombre-unico]
Ejemplo: budget-tracker-images-juan2024
```

**AWS Region:**
```
Selecciona la región más cercana a tus usuarios
Recomendado: us-east-1 (Virginia) o sa-east-1 (São Paulo)
```

**Object Ownership:**
```
✅ ACLs disabled (recommended)
```

**Block Public Access settings:**
```
❌ Block all public access (DESMARCAR)
✅ Block public access to buckets and objects granted through new access control lists (ACLs)
✅ Block public access to buckets and objects granted through any access control lists (ACLs)
❌ Block public access to buckets and objects granted through new public bucket or access point policies (DESMARCAR)
❌ Block public access to buckets and objects granted through any public bucket or access point policies (DESMARCAR)

⚠️ Confirma: "I acknowledge that the current settings might result in this bucket and the objects within becoming public"
```

**Bucket Versioning:**
```
✅ Enable (recomendado para backup)
```

**Default encryption:**
```
✅ Server-side encryption with Amazon S3 managed keys (SSE-S3)
```

3. Haz clic en **"Create bucket"**

## 🔧 Paso 2: Configurar Estructura de Carpetas

### 2.1 Crear Carpetas
1. Entra al bucket recién creado
2. Haz clic en **"Create folder"**
3. Crea estas carpetas:

```
📁 profile-images/
📁 company-logos/
📁 temp/
```

Para cada carpeta:
- Nombre: `profile-images`, `company-logos`, `temp`
- Encryption: Use bucket settings
- Haz clic en **"Create folder"**

## 🔒 Paso 3: Configurar Políticas de Acceso

### 3.1 Configurar Bucket Policy
1. Ve a la pestaña **"Permissions"**
2. Scroll hasta **"Bucket policy"**
3. Haz clic en **"Edit"**
4. Pega esta política (reemplaza `TU-BUCKET-NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::TU-BUCKET-NAME/profile-images/*"
    },
    {
      "Sid": "PublicReadCompanyLogos",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::TU-BUCKET-NAME/company-logos/*"
    }
  ]
}
```

5. Haz clic en **"Save changes"**

### 3.2 Configurar CORS
1. En la misma pestaña **"Permissions"**
2. Scroll hasta **"Cross-origin resource sharing (CORS)"**
3. Haz clic en **"Edit"**
4. Pega esta configuración:

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedOrigins": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-meta-custom-header"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

5. Haz clic en **"Save changes"**

## 👤 Paso 4: Crear Usuario IAM para la Aplicación

### 4.1 Crear Usuario IAM
1. Ve al servicio **IAM** en AWS Console
2. Haz clic en **"Users"** en el menú lateral
3. Haz clic en **"Create user"**

**Configuración del Usuario:**
```
User name: budget-tracker-s3-user
✅ Provide user access to the AWS Management Console - optional (NO marcar)
```

### 4.2 Configurar Permisos
1. En **"Set permissions"**, selecciona **"Attach policies directly"**
2. Haz clic en **"Create policy"**
3. Ve a la pestaña **"JSON"**
4. Pega esta política (reemplaza `TU-BUCKET-NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::TU-BUCKET-NAME/profile-images/*",
        "arn:aws:s3:::TU-BUCKET-NAME/company-logos/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::TU-BUCKET-NAME"
    }
  ]
}
```

5. Haz clic en **"Next"**
6. Nombre de la política: `BudgetTrackerS3Policy`
7. Haz clic en **"Create policy"**
8. Vuelve a la creación del usuario y selecciona la política recién creada
9. Haz clic en **"Create user"**

### 4.3 Crear Access Keys
1. Haz clic en el usuario recién creado
2. Ve a la pestaña **"Security credentials"**
3. Haz clic en **"Create access key"**
4. Selecciona **"Application running outside AWS"**
5. Haz clic en **"Next"**
6. Descripción: `Budget Tracker App`
7. Haz clic en **"Create access key"**

⚠️ **IMPORTANTE**: Guarda estas credenciales de forma segura:
```
Access Key ID: AKIA...
Secret Access Key: ...
```

## 🔧 Paso 5: Configurar en la Aplicación

### 5.1 Crear archivo de configuración
Crea `.env.local` (si no existe) y agrega:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu-access-key-id
AWS_SECRET_ACCESS_KEY=tu-secret-access-key
AWS_S3_BUCKET_NAME=budget-tracker-images-tu-nombre
AWS_S3_BUCKET_URL=https://budget-tracker-images-tu-nombre.s3.amazonaws.com
```

### 5.2 Instalar AWS SDK v3
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 5.3 Actualizar StorageService
Actualiza `src/lib/services/storageService.ts`:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configurar AWS S3 Client (v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class StorageService {
  private static bucketName = process.env.AWS_S3_BUCKET_NAME!;
  private static bucketUrl = process.env.AWS_S3_BUCKET_URL!;

  // Subir imagen de perfil
  static async uploadProfileImage(file: File, userId: string): Promise<string> {
    try {
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const resizedFile = await this.resizeImage(file, 400);
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile-images/${userId}_${Date.now()}.${fileExtension}`;

      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: resizedFile,
        ContentType: resizedFile.type,
        ACL: 'public-read'
      };

      const result = await s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new Error('Error al subir la imagen de perfil');
    }
  }

  // Subir logo de empresa
  static async uploadCompanyLogo(file: File, userId: string): Promise<string> {
    try {
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const resizedFile = await this.resizeImage(file, 200);
      const fileExtension = file.name.split('.').pop();
      const fileName = `company-logos/${userId}_${Date.now()}.${fileExtension}`;

      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: resizedFile,
        ContentType: resizedFile.type,
        ACL: 'public-read'
      };

      const result = await s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      console.error('Error uploading company logo:', error);
      throw new Error('Error al subir el logo de la empresa');
    }
  }

  // Eliminar imagen
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      const key = imageUrl.replace(this.bucketUrl + '/', '');
      
      const deleteParams = {
        Bucket: this.bucketName,
        Key: key
      };

      await s3.deleteObject(deleteParams).promise();
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }

  // ... resto de métodos (validateImageFile, resizeImage)
}
```

## 🧪 Paso 6: Probar la Configuración

### 6.1 Test Manual
1. Ve a tu aplicación
2. Intenta subir una imagen de perfil
3. Verifica que aparezca en el bucket S3
4. Confirma que la imagen se muestre en la aplicación

### 6.2 Verificar URLs
Las URLs deberían verse así:
```
https://budget-tracker-images-tu-nombre.s3.amazonaws.com/profile-images/user123_1234567890.jpg
```

## 📊 Paso 7: Monitoreo y Costos

### 7.1 Configurar Alertas de Costo
1. Ve a **AWS Billing Dashboard**
2. Configura alertas para cuando el costo supere $10 USD

### 7.2 Lifecycle Policies (Opcional)
Para optimizar costos:
1. Ve a tu bucket S3
2. Pestaña **"Management"**
3. **"Create lifecycle rule"**
4. Configura para mover archivos antiguos a storage más barato

## 🚨 Troubleshooting

### Error: Access Denied
- Verifica que la bucket policy esté correcta
- Confirma que las credenciales IAM sean válidas
- Revisa que el usuario tenga los permisos necesarios

### Error: CORS
- Verifica la configuración CORS
- Asegúrate de que tu dominio esté permitido

### Error: File Too Large
- Implementa validación de tamaño en el frontend
- Configura límites en la aplicación

## 📝 Checklist Final

- [ ] Bucket S3 creado
- [ ] Carpetas creadas (profile-images, company-logos)
- [ ] Bucket policy configurada
- [ ] CORS configurado
- [ ] Usuario IAM creado
- [ ] Access keys generadas
- [ ] Variables de entorno configuradas
- [ ] StorageService actualizado
- [ ] Pruebas realizadas

## 💰 Estimación de Costos

**Para 1000 usuarios activos:**
- Almacenamiento: ~$0.50/mes (20GB)
- Requests: ~$0.40/mes (100K requests)
- Transfer: ~$0.90/mes (10GB transfer)

**Total estimado: ~$2 USD/mes**

---

¡Con esta configuración manual tendrás S3 funcionando perfectamente para tu Budget Tracker! 🎉

**Próximo paso:** Actualizar el código para usar las funciones reales de S3 en lugar de las simuladas.