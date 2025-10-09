/**
 * Script para diagnosticar problemas de S3 en producción vs local
 */

console.log('🔍 Diagnóstico de S3 - Producción vs Local');
console.log('=' .repeat(50));

// 1. Verificar variables de entorno
console.log('\n📋 Variables de Entorno:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_ENV:', process.env.NEXT_PUBLIC_ENV);

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

// 3. Problemas comunes en Amplify
console.log('\n⚠️  Problemas Comunes en AWS Amplify:');
console.log('1. Variables de entorno no configuradas en la consola de Amplify');
console.log('2. Variables NEXT_PUBLIC_ no están disponibles en build time');
console.log('3. Credenciales de AWS incorrectas o sin permisos');
console.log('4. Bucket S3 no existe o no tiene permisos públicos');
console.log('5. Región incorrecta');

// 4. Recomendaciones
console.log('\n💡 Recomendaciones:');
if (!serverConfigComplete) {
  console.log('❌ Configurar variables de servidor en AWS Amplify Console:');
  console.log('   - AWS_REGION');
  console.log('   - AWS_S3_BUCKET_NAME');
  console.log('   - AWS_ACCESS_KEY_ID');
  console.log('   - AWS_SECRET_ACCESS_KEY');
}

if (!clientConfigComplete) {
  console.log('❌ Configurar variables de cliente en AWS Amplify Console:');
  console.log('   - NEXT_PUBLIC_AWS_REGION');
  console.log('   - NEXT_PUBLIC_AWS_S3_BUCKET_NAME');
  console.log('   - NEXT_PUBLIC_AWS_S3_BUCKET_URL');
  console.log('   - NEXT_PUBLIC_AWS_ACCESS_KEY_ID');
  console.log('   - NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY');
}

console.log('\n🔧 Pasos para solucionar:');
console.log('1. Ir a AWS Amplify Console');
console.log('2. Seleccionar tu aplicación');
console.log('3. Ir a "Environment variables"');
console.log('4. Agregar todas las variables necesarias');
console.log('5. Hacer redeploy de la aplicación');

console.log('\n📝 Variables que debes agregar en Amplify:');
console.log(`AWS_REGION=${process.env.AWS_REGION || 'us-east-1'}`);
console.log(`AWS_S3_BUCKET_NAME=${process.env.AWS_S3_BUCKET_NAME || 'budget-tracker-images-romy'}`);
console.log(`AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID || 'TU_ACCESS_KEY'}`);
console.log(`AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY || 'TU_SECRET_KEY'}`);
console.log(`NEXT_PUBLIC_AWS_REGION=${process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'}`);
console.log(`NEXT_PUBLIC_AWS_S3_BUCKET_NAME=${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || 'budget-tracker-images-romy'}`);
console.log(`NEXT_PUBLIC_AWS_S3_BUCKET_URL=${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || 'https://budget-tracker-images-romy.s3.amazonaws.com'}`);
console.log(`NEXT_PUBLIC_AWS_ACCESS_KEY_ID=${process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || 'TU_ACCESS_KEY'}`);
console.log(`NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=${process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || 'TU_SECRET_KEY'}`);

console.log('\n🎯 Resultado del diagnóstico:');
if (serverConfigComplete && clientConfigComplete) {
  console.log('✅ Configuración completa - El problema puede ser de permisos o conectividad');
} else {
  console.log('❌ Configuración incompleta - Agregar variables faltantes en Amplify');
}