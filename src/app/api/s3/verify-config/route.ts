import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar variables de servidor (privadas)
    const serverConfig = {
      AWS_REGION: !!process.env.AWS_REGION,
      AWS_S3_BUCKET_NAME: !!process.env.AWS_S3_BUCKET_NAME,
      AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
    };

    // Verificar variables de cliente (públicas)
    const clientConfig = {
      NEXT_PUBLIC_AWS_REGION: !!process.env.NEXT_PUBLIC_AWS_REGION,
      NEXT_PUBLIC_AWS_S3_BUCKET_NAME: !!process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      NEXT_PUBLIC_AWS_S3_BUCKET_URL: !!process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL,
      NEXT_PUBLIC_AWS_ACCESS_KEY_ID: !!process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: !!process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    };

    const serverComplete = Object.values(serverConfig).every(Boolean);
    const clientComplete = Object.values(clientConfig).every(Boolean);

    return NextResponse.json({
      status: serverComplete && clientComplete ? 'SUCCESS' : 'INCOMPLETE',
      environment: process.env.NODE_ENV || 'unknown',
      serverConfig,
      clientConfig,
      serverComplete,
      clientComplete,
      message: serverComplete && clientComplete 
        ? 'S3 configuration is complete' 
        : 'S3 configuration is incomplete',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'ERROR',
        error: 'Error checking S3 configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}