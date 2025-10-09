import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const config = {
      AWS_REGION: process.env.AWS_REGION,
      AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyLength: process.env.AWS_ACCESS_KEY_ID?.length || 0,
      secretKeyLength: process.env.AWS_SECRET_ACCESS_KEY?.length || 0,
    };

    return NextResponse.json({
      message: 'S3 Configuration Debug',
      config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error checking S3 configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}