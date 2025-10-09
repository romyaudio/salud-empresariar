import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Obtener valores reales (no solo boolean)
    const serverVars = {
      AWS_REGION: process.env.AWS_REGION,
      AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    };

    const clientVars = {
      NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
      NEXT_PUBLIC_AWS_S3_BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      NEXT_PUBLIC_AWS_S3_BUCKET_URL: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL,
      NEXT_PUBLIC_AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    };

    // Análisis detallado
    const analysis = {
      serverVars: Object.entries(serverVars).map(([key, value]) => ({
        name: key,
        exists: value !== undefined,
        isEmpty: value === '',
        isNull: value === null,
        type: typeof value,
        length: value ? value.length : 0,
        firstChars: value ? value.substring(0, 5) + '...' : 'N/A',
        hasSpaces: value ? (value.startsWith(' ') || value.endsWith(' ')) : false
      })),
      clientVars: Object.entries(clientVars).map(([key, value]) => ({
        name: key,
        exists: value !== undefined,
        isEmpty: value === '',
        isNull: value === null,
        type: typeof value,
        length: value ? value.length : 0,
        firstChars: value ? value.substring(0, 5) + '...' : 'N/A',
        hasSpaces: value ? (value.startsWith(' ') || value.endsWith(' ')) : false
      }))
    };

    // Información del entorno
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      AWS_REGION: process.env.AWS_REGION,
      totalEnvVars: Object.keys(process.env).length,
      awsVarsCount: Object.keys(process.env).filter(key => key.startsWith('AWS_')).length,
      nextPublicVarsCount: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')).length
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      envInfo,
      analysis,
      rawServerVars: serverVars,
      rawClientVars: clientVars,
      debug: {
        message: 'Detailed environment variable analysis',
        note: 'Check if variables exist, are empty, or have spaces'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error in detailed debug',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}