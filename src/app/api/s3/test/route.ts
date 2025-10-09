import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar variables de entorno
    const config = {
      AWS_REGION: process.env.AWS_REGION,
      AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    };

    return NextResponse.json({
      message: 'S3 Configuration Check',
      config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking S3 config:', error);
    return NextResponse.json(
      { error: 'Error checking configuration' },
      { status: 500 }
    );
  }
}