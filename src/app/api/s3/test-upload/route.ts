import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Configurar AWS S3 Client (v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  return POST(request);
}

export async function POST(request: NextRequest) {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    if (!bucketName) {
      return NextResponse.json(
        { error: 'Bucket S3 no configurado' },
        { status: 500 }
      );
    }

    // Test: Crear un archivo de prueba
    const testContent = `Test file created at ${new Date().toISOString()}`;
    const testKey = `test/test-${Date.now()}.txt`;

    // Subir archivo de prueba
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain'
      // Removido ACL - el bucket usa bucket policy para acceso público
    });

    const uploadResult = await s3Client.send(uploadCommand);

    // Verificar que se puede leer
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: testKey
    });

    const getResult = await s3Client.send(getCommand);

    // Limpiar - eliminar archivo de prueba
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: testKey
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json({
      success: true,
      message: 'S3 funcionando correctamente',
      uploadUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${testKey}`,
      bucketName,
      region: process.env.AWS_REGION,
      etag: uploadResult.ETag
    });

  } catch (error) {
    console.error('S3 Test Error:', error);
    return NextResponse.json(
      { 
        error: 'Error en test de S3',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}