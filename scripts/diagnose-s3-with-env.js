/**
 * Script para diagnosticar problemas de S3 con variables de entorno cargadas
 */

// Cargar variables de entorno desde .env.local
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Diagnóstico de S3 - Con Variables de Entorno Cargadas');
console.log('=' .repeat(60));

// 1. Verificar variables de entorno
console.log('\n📋 Variables de Entorno:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('NEXT_PUBLIC_ENV:', process.env.NEXT_PUBLIC_ENV || 'undefined');

// Variables de S3 del servidor (privadas)
console.log('\n🔐 Variables de S3 (Server-side):');
console.log('AWS_REGION:', process.env.AWS_REGION || '❌ NO DEFINIDA');
console.log('AWS_S3_BUCKET_NAME:', process.env.AWS_S3_BUCKET_NAME || '❌ NO DEFINIDA');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? `✅ Definida (${process.env.AWS_ACCESS_KEY_ID.length} chars)` : '❌ NO DEFINIDA');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? `✅ Definida (${process.env.AWS_SECRET_ACCESS_KEY.length} chars)` : '❌ NO DEFINIDA');

// Variables de S3 del cliente (públicas)
console.log('\n🌐 Variables de S3 (Client-side):');
console.log('NEXT_PUBLIC_AWS_REGION:', process.env.NEXT_PUBLIC_AWS_REGION || '❌ NO DEFINIDA');
console.log('NEXT_PUBLIC_AWS_S3_BUCKET_NAME:', process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || '❌ NO DEFINIDA');
console.log('NEXT_PUBLIC_AWS_S3_BUCKET_URL:', process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || '❌ NO DEFINIDA');
console.log('NEXT_PUBLIC_AWS_ACCESS_KEY_ID:', process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ? `✅ Definida (${process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID.length} chars)` : '❌ NO DEFINIDA');
console.log('NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY:', process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ? `✅ Definida (${process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY.length} chars)` : '❌ NO DEFINIDA');

// 2. Verificar configuración completa
console.log('\n✅ Estado de Configuración:');
const serverConfigComplete = !!(
  process.env.AWS_REGION &&
  process.env.AWS_S3_BUCKET_NAME &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY
);

const clientConfigComplete = !!(
  process.env.NEXT_PUBLIC_AWS_REGION &&
  process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME &&
  process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL &&
  process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID &&
  process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
);

console.log('Configuración Server-side:', serverConfigComplete ? '✅ COMPLETA' : '❌ INCOMPLETA');
console.log('Configuración Client-side:', clientConfigComplete ? '✅ COMPLETA' : '❌ INCOMPLETA');

// 3. Test de conectividad S3 (si está configurado)
if (serverConfigComplete) {
  console.log('\n🧪 Test de Conectividad S3:');
  
  const { S3Client, HeadBucketCommand } = require('@aws-sdk/client-s3');
  
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Test de acceso al bucket
  (async () => {
    try {
      console.log('Probando acceso al bucket...');
      const command = new HeadBucketCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME
      });
      
      await s3Client.send(command);
      console.log('✅ Bucket accesible correctamente');
    } catch (error) {
      console.log('❌ Error accediendo al bucket:', error.message);
      
      if (error.name === 'NotFound') {
        console.log('   → El bucket no existe');
      } else if (error.name === 'Forbidden') {
        console.log('   → Sin permisos para acceder al bucket');
      } else if (error.name === 'InvalidAccessKeyId') {
        console.log('   → Access Key ID inválido');
      } else if (error.name === 'SignatureDoesNotMatch') {
        console.log('   → Secret Access Key incorrecto');
      }
    }
  })();
}

// 4. Generar configuración para Amplify
console.log('\n📝 Variables para AWS Amplify Console:');
console.log('Copia estas variables en AWS Amplify > Environment variables:');
console.log('');
console.log(`AWS_REGION=${process.env.AWS_REGION || 'us-east-1'}`);
console.log(`AWS_S3_BUCKET_NAME=${process.env.AWS_S3_BUCKET_NAME || 'budget-tracker-images-romy'}`);
console.log(`AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID || '[TU_ACCESS_KEY_ID]'}`);
console.log(`AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY || '[TU_SECRET_ACCESS_KEY]'}`);
console.log('');
console.log(`NEXT_PUBLIC_AWS_REGION=${process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'}`);
console.log(`NEXT_PUBLIC_AWS_S3_BUCKET_NAME=${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || 'budget-tracker-images-romy'}`);
console.log(`NEXT_PUBLIC_AWS_S3_BUCKET_URL=${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || 'https://budget-tracker-images-romy.s3.amazonaws.com'}`);
console.log(`NEXT_PUBLIC_AWS_ACCESS_KEY_ID=${process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '[TU_ACCESS_KEY_ID]'}`);
console.log(`NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=${process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '[TU_SECRET_ACCESS_KEY]'}`);

console.log('\n🎯 Resumen del Problema:');
if (serverConfigComplete && clientConfigComplete) {
  console.log('✅ Local: Configuración S3 completa');
  console.log('❌ Amplify: Variables no configuradas en la consola');
  console.log('');
  console.log('SOLUCIÓN:');
  console.log('1. Ir a AWS Amplify Console');
  console.log('2. Seleccionar tu aplicación');
  console.log('3. Ir a "Environment variables"');
  console.log('4. Agregar todas las variables mostradas arriba');
  console.log('5. Hacer redeploy de la aplicación');
} else {
  console.log('❌ Configuración incompleta incluso en local');
  console.log('Revisar archivo .env.local');
}

console.log('\n⚠️  IMPORTANTE:');
console.log('Las credenciales AWS mostradas son sensibles.');
console.log('Asegúrate de que solo tengan permisos mínimos necesarios para S3.');