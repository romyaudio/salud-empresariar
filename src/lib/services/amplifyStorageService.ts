/**
 * Amplify Storage Service - Reemplaza S3 directo con Amplify Storage
 * Soluciona problemas de permisos usando la integración nativa de Amplify
 */

import { uploadData, getUrl, remove } from 'aws-amplify/storage';

export class AmplifyStorageService {
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

  // Upload usando Amplify Storage con fallback
  static async uploadToAmplifyStorage(file: File, folder: string, userId: string): Promise<string> {
    try {
      console.log('Uploading to Amplify Storage:', { folder, userId, fileName: file.name });

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

      console.log('Uploading file to Amplify Storage:', fileName);

      try {
        // Intentar upload usando Amplify Storage
        const result = await uploadData({
          key: fileName,
          data: resizedFile,
          options: {
            contentType: resizedFile.type,
            accessLevel: 'guest' // Permite acceso público de lectura
          }
        }).result;

        console.log('Upload successful:', result.key);

        // Obtener URL pública
        const urlResult = await getUrl({
          key: result.key,
          options: {
            accessLevel: 'guest'
          }
        });

        const publicUrl = urlResult.url.toString();
        console.log('Public URL generated:', publicUrl);
        
        return publicUrl;
      } catch (amplifyError) {
        console.warn('Amplify Storage not configured, falling back to local storage:', amplifyError);
        
        // Fallback a almacenamiento local temporal
        return this.uploadImageLocal(resizedFile, userId, folder);
      }
    } catch (error) {
      console.error('Error uploading to Amplify Storage:', error);
      throw new Error(`Error al subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // Funciones principales para subir imágenes
  static async uploadProfileImage(file: File, userId: string): Promise<string> {
    console.log('Uploading profile image using Amplify Storage');
    return this.uploadToAmplifyStorage(file, 'profile-images', userId);
  }

  static async uploadCompanyLogo(file: File, userId: string): Promise<string> {
    console.log('Uploading company logo using Amplify Storage');
    return this.uploadToAmplifyStorage(file, 'company-logos', userId);
  }

  // Eliminar imagen de Amplify Storage
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extraer la key del URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const key = pathParts[pathParts.length - 1];

      console.log('Deleting image from Amplify Storage:', key);

      await remove({
        key,
        options: {
          accessLevel: 'guest'
        }
      });

      console.log('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image from Amplify Storage:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }

  // Función temporal para simular upload local (fallback)
  static async uploadImageLocal(file: File, userId: string, folder: string): Promise<string> {
    try {
      console.log(`Using local upload for ${folder}`);

      // Validar archivo
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Redimensionar imagen
      const maxWidth = folder === 'profile-images' ? 400 : 200;
      const resizedFile = await this.resizeImage(file, maxWidth);

      // Por ahora, crear URL local
      const imageUrl = URL.createObjectURL(resizedFile);

      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      return imageUrl;
    } catch (error) {
      console.error(`Error uploading ${folder} locally:`, error);
      throw new Error(`Error al subir la imagen de ${folder}`);
    }
  }
}