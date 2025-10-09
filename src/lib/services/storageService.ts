/**
 * Storage Service for handling image uploads to AWS S3
 * Supports both local development and production S3
 */

// Configuración S3 (se carga desde variables de entorno)
const S3_CONFIG = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  bucketName: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || '',
  bucketUrl: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || '',
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ''
};

export class StorageService {
  // Verificar si S3 está configurado
  static isS3Configured(): boolean {
    const isConfigured = !!(S3_CONFIG.bucketName && S3_CONFIG.accessKeyId && S3_CONFIG.secretAccessKey);
    console.log('S3 Configuration Check:', {
      bucketName: S3_CONFIG.bucketName,
      hasAccessKey: !!S3_CONFIG.accessKeyId,
      hasSecretKey: !!S3_CONFIG.secretAccessKey,
      isConfigured
    });
    return isConfigured;
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

  // Redimensionar imagen
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

  // Upload a S3 usando presigned URLs
  static async uploadToS3(file: File, folder: string, userId: string): Promise<string> {
    try {
      console.log('Uploading to S3:', { folder, userId, fileName: file.name });

      // Validar archivo
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Redimensionar imagen
      const maxWidth = folder === 'profile-images' ? 400 : 200;
      const resizedFile = await this.resizeImage(file, maxWidth);

      const fileExtension = file.name.split('.').pop();
      const fileName = `${folder}/${userId}_${Date.now()}.${fileExtension}`;

      console.log('Getting presigned URL for:', fileName);

      // Obtener URL presignada
      const response = await fetch('/api/s3/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          contentType: resizedFile.type,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Presigned URL error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }

        throw new Error(`Error obteniendo URL presignada: ${errorData.error || response.statusText}`);
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }

        throw new Error(errorData.error || `Error obteniendo URL presignada: ${response.status}`);
      }

      const { uploadUrl } = await response.json();
      console.log('Got presigned URL, uploading file...');

      // Upload directo a S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: resizedFile,
        headers: {
          'Content-Type': resizedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('S3 Upload error:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          error: errorText
        });
        throw new Error(`Error al subir archivo a S3: ${uploadResponse.status} - ${errorText}`);
      }

      // Retornar URL pública
      const publicUrl = `${S3_CONFIG.bucketUrl}/${fileName}`;
      console.log('Upload successful:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Error al subir la imagen a S3');
    }
  }

  // Función temporal para simular upload (hasta que S3 esté configurado)
  static async uploadProfileImageLocal(file: File, userId: string): Promise<string> {
    try {
      console.log('Using local upload for profile image');

      // Validar archivo
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Redimensionar imagen
      const resizedFile = await this.resizeImage(file, 400);

      // Por ahora, crear URL local (reemplazar con S3 cuando esté configurado)
      const imageUrl = URL.createObjectURL(resizedFile);

      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      return imageUrl;
    } catch (error) {
      console.error('Error uploading profile image locally:', error);
      throw new Error('Error al subir la imagen de perfil');
    }
  }

  // Función temporal para simular upload de logo
  static async uploadCompanyLogoLocal(file: File, userId: string): Promise<string> {
    try {
      console.log('Using local upload for company logo');

      // Validar archivo
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Redimensionar imagen
      const resizedFile = await this.resizeImage(file, 200);

      // Por ahora, crear URL local (reemplazar con S3 cuando esté configurado)
      const logoUrl = URL.createObjectURL(resizedFile);

      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      return logoUrl;
    } catch (error) {
      console.error('Error uploading company logo locally:', error);
      throw new Error('Error al subir el logo de la empresa');
    }
  }

  // Funciones principales que deciden entre S3 o local
  static async uploadProfileImage(file: File, userId: string): Promise<string> {
    if (this.isS3Configured()) {
      console.log('S3 is configured, using S3 upload');
      return this.uploadToS3(file, 'profile-images', userId);
    } else {
      console.log('S3 not configured, using local upload');
      return this.uploadProfileImageLocal(file, userId);
    }
  }

  static async uploadCompanyLogo(file: File, userId: string): Promise<string> {
    if (this.isS3Configured()) {
      console.log('S3 is configured, using S3 upload');
      return this.uploadToS3(file, 'company-logos', userId);
    } else {
      console.log('S3 not configured, using local upload');
      return this.uploadCompanyLogoLocal(file, userId);
    }
  }

  // Eliminar imagen de S3
  static async deleteImageFromS3(imageUrl: string): Promise<void> {
    if (!this.isS3Configured()) {
      console.log('S3 no configurado, no se puede eliminar imagen');
      return;
    }

    try {
      const fileName = imageUrl.replace(S3_CONFIG.bucketUrl + '/', '');

      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        throw new Error('Error eliminando imagen de S3');
      }
    } catch (error) {
      console.error('Error deleting image from S3:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }
}